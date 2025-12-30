import { useState, useEffect } from "react";
import {
  Table, TableCell, TableHead, TableRow, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Box,
  Stack,
  Typography
} from "@mui/material";
import { KakeiboItem } from "../typs";
import { tableSx, tableRowSx as tableRowSx } from "./Category";
import { 
  headers,
} from "../assets/util";
import PaymentForm from "../assets/components/PaymentForm";
import { addExpense, deleteExpense, getExpenses, updateExpense } from "../db/indexedDB";
import { useNavigate } from "react-router-dom";

export default function Input() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<KakeiboItem[]>([]);
  const [selectedRow, setSelectedRow] = useState<KakeiboItem | null>(null);
  // ソート用
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

 // 削除確認ダイアログ用
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [category, setCategory] = useState<"収入" | "固定費" | "生活費">("収入");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState<number>(1);
  const [amount, setAmount] = useState(0);
  const [payment, setPayment] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [incomeItems, setIncomeItems] = useState<any[]>([]);
  const [expenditureItems, setExpenditureItems] = useState<any[]>([]);
  const [livingItems, setLivingItems] = useState<any[]>([]); // 初期読み込み

  const [settingOpen, setSettingOpen] = useState(false);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // localStorage から読み込み
    const income = JSON.parse(localStorage.getItem("incomeItems") ?? "[]");
    const exp = JSON.parse(localStorage.getItem("expenditureItems") ?? "[]");
    const living = JSON.parse(localStorage.getItem("livingItems") ?? "[]");

    setIncomeItems(income);
    setExpenditureItems(exp);
    setLivingItems(living);

    setLoaded(true); // ← 読み込み完了
  }, []);

  useEffect(() => {
    if (!loaded) return; // ← 読み込み前は判定しない

    const noCategories =
      incomeItems.length === 0 &&
      expenditureItems.length === 0 &&
      livingItems.length === 0;

    if (noCategories) {
      setSettingOpen(true);
    }
  }, [loaded, incomeItems, expenditureItems, livingItems]);



  const navigate = useNavigate();

  // 初期読み込み
  useEffect(() => {
    getExpenses().then(setItems);
  }, []);

  useEffect(() => {
    const today = new Date();
    const m = today.getMonth() + 1; // 月（0始まりなので+1）
    const d = today.getDate();      // 日

    setMonth(m);
    setDate(`${m}/${d}`); // 例: "3/15"
  }, []);

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  // 確認ダイアログで「はい」を押したとき → 実際に削除
  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    await deleteExpense(selectedRow.id);
      const updated = await getExpenses();
      setItems(updated);

    setConfirmOpen(false);
    setOpen(false);
    setSelectedRow(null);
    setName("");
    setAmount(0);
    setPayment("");
    setDate("");
  };

  // 確認ダイアログで「キャンセル」を押したとき
  const handleDeleteCancel = () => {
    setConfirmOpen(false);
  };

  // 並べ替え処理
  const sortedRows = [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // 並べ替え後に累積合計を計算しながら表示用データを作成
  let runningTotal = 0;
  const rowsWithTotal = sortedRows.map((row) => {
    const expenditure =
      row.category === "固定費" || row.category === "生活費" ? row.amount : 0;
    const income = row.category === "収入" ? row.amount : 0;

    runningTotal += income - expenditure;

    return {
      ...row,
      expenditure,
      income,
      cumulativeTotal: runningTotal,
    };
  });

  useEffect(() => { getExpenses().then(setItems); // ★ 追加：localStorage から項目を読み込む　
    const savedIncome = localStorage.getItem("incomeItems");
    const savedExpenditure = localStorage.getItem("expenditureItems");
    const savedLiving = localStorage.getItem("livingItems");

    if (savedIncome) setIncomeItems(JSON.parse(savedIncome));
    if (savedExpenditure) setExpenditureItems(JSON.parse(savedExpenditure));
    if (savedLiving) setLivingItems(JSON.parse(savedLiving));
  }, []);

  useEffect(() => {
    const today = new Date(); const m = today.getMonth() + 1;
    const d = today.getDate(); setMonth(m); setDate(`${m}/${d}`);
  }, []);

  const handleRowClick = (row: KakeiboItem) => {
    setSelectedRow(row);
    setCategory(row.category); setName(row.name); setDate(row.date);
    setMonth(row.month); setAmount(row.amount); setPayment(row.payment || "");
    setOpen(true);
  };
  
  const handleSave = async () => {
    const newItem: KakeiboItem = {
      id: selectedRow ? 
        selectedRow.id :
        Date.now(), date, month, category, name, // ← 表示名をそのまま保存 
        amount: Number(amount), payment, paymentType,
      };
      if (selectedRow) {
        await updateExpense(newItem);
      } else {
        await addExpense(newItem);
      }
    const updated = await getExpenses();
      setItems(updated); setOpen(false);
      setSelectedRow(null); setName("");
      setAmount(0); setPayment("");
      setPaymentType(""); setDate("");
    }; // ★ 修正：localStorage の値を返す
    
  const getItemsByCategory = (category: "収入" | "固定費" | "生活費") => {
    switch (category) {
      case "収入": return incomeItems;
      case "固定費": return expenditureItems;
      case "生活費": return livingItems;
      default: return [];
    }
  };

  return (
    <Box m={2}>
      <Dialog open={settingOpen} onClose={() => setSettingOpen(false)}>
        <DialogTitle>初期設定</DialogTitle>

        <DialogContent>
          <Typography>
            設定で費目を登録してください
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSettingOpen(false)} variant="outlined">閉じる</Button>
          <Button onClick={()=> navigate(`/settings`)} variant="contained">設定画面へ</Button>
        </DialogActions>
      </Dialog>
      <Box m={2}>
      <Button variant="contained" onClick={() => {
        setSelectedRow(null);
        setOpen(true);
      }}>
        新規入力
      </Button>
      </Box>
      <Table className="table-container" sx={tableSx}>
        <TableHead>
          <TableRow sx={tableRowSx}>
            {headers
              .filter((h) => h.Headers !== "平均" && h.Headers !== "カテゴリ")
              .map((h) => (
                <TableCell key={h.accessor} sx={{ verticalAlign: "middle" }} >
                  {h.Headers === "年月日" ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems:"center"}}>
                      <span>{h.Headers}</span>
                      <Button
                        size="small"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        sx={{ minWidth: 0, px: 1 }}
                      >
                        {sortOrder === "asc" ? "↓" : "↑"}
                      </Button>
                    </Box>
                  ) : (
                    h.Headers
                  )}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsWithTotal.map((row) => (
            <TableRow
              key={row.id}
              hover
              onClick={() => handleRowClick(row)}
              style={{ cursor: "pointer" }}
            >
              {/* <TableCell>{row.date}</TableCell> */}
              <TableCell>{new Date(row.date).getMonth() + 1}/{new Date(row.date).getDate()}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.expenditure}</TableCell>
              <TableCell>{row.income}</TableCell>
              <TableCell style={{ color: row.cumulativeTotal < 0 ? "red" : "black" }}>
                {row.cumulativeTotal}
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
      {/* 入力フォーム */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>家計簿入力</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>カテゴリ</InputLabel>
            <Select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "収入" | "固定費" | "生活費")
              }
            >
              <MenuItem value="収入">収入</MenuItem>
              <MenuItem value="固定費">固定費</MenuItem>
              <MenuItem value="生活費">生活費</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>費目名</InputLabel>
            <Select value={name} onChange={(e) => setName(e.target.value)}>
              {(getItemsByCategory(category) || []).map((item: any, index: number) => (
                <MenuItem key={`${item.accessor}-${index}`} value={item.Headers}>
                  {item.Headers}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* 収入以外のときだけ支払方法を表示 */}
          {category !== "収入" && (
            <PaymentForm
              payment={payment}
              paymentType={paymentType}
              onChange={({ payment, paymentType }: any) => {
                setPayment(payment);
                setPaymentType(paymentType);
              }}
            />
          )}
          <TextField
            margin="dense"
            label="日付"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => {
              const value = e.target.value;
              setDate(value);
              const monthValue = new Date(value).getMonth() + 1;
              setMonth(monthValue);
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            label={category === "収入" ? "収入金額" : "支出金額"}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%",m:2 }}>
            {selectedRow && (
              <Button onClick={handleDeleteClick} variant="contained" color="error">
                削除
              </Button>
            )}
            <Stack direction="row" spacing={2}>
              <Button onClick={() => setOpen(false)} variant="outlined">キャンセル</Button>
              <Button onClick={handleSave} variant="contained" color="primary">
                保存
              </Button>
            </Stack>
          </Box>
        </DialogActions>
      </Dialog>
      {/* 削除確認ダイアログ */}
      <Dialog open={confirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>削除確認</DialogTitle>
        <DialogContent>
          {selectedRow ? `${selectedRow.name} を本当に削除しますか？` : "本当に削除しますか？"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


