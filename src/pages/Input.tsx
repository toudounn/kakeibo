import { useState, useEffect } from "react";
import {
  Table, TableCell, TableHead, TableRow, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { KakeiboItem } from "../typs";

const headers = [
  { Headers: "年月日", accessor: "date" },
  { Headers: "費目", accessor: "category" },
  { Headers: "支出", accessor: "expenditure" },
  { Headers: "収入", accessor: "income" },
  { Headers: "合計", accessor: "total" },
];

// 費目リストを定義
const incomeItems = ["奈緒子", "佑弥", "將", "嵩大", "年金"];
const expenditureItems = [
  "電気", "電話", "水道", "ガス", "灯油", "NHK", "保険", "米",
  "教育ローン", "車ローン", "SS", "病院", "交通費", "小遣い"
];
const livingItems = ["食費", "雑費", "嗜好品", "特別支出"];

export default function Input() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<KakeiboItem[]>([]);

  // 入力フォーム用の state
  const [category, setCategory] = useState<"収入" | "支出" | "生活費">("収入");
  const [name, setName] = useState("");
  const [date,setDate] = useState("");
  const [month, setMonth] = useState<number>(1);
  const [amount, setAmount] = useState(0);
  const [payment,setPayment] = useState("")

  // 初期ロード時に localStorage から読み込み
  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // 保存処理
  const handleSave = () => {
  const newItem: KakeiboItem = {
    id: Date.now(),
    date,                  // 入力した年月日 (YYYY-MM-DD)
    month,                 // 日付から自動計算された月
    category,
    name,
    amount: Number(amount),
    payment,
  };

  const stored = localStorage.getItem("expenses");
  const parsed: KakeiboItem[] = stored ? JSON.parse(stored) : [];
  parsed.push(newItem);
  localStorage.setItem("expenses", JSON.stringify(parsed));
  setItems(parsed);

  setOpen(false);
  setName("");
  setAmount(0);
  setPayment("");
  setDate("");
};


// カテゴリに応じて費目リストを切り替える関数
const getItemsByCategory = (category: "収入" | "支出" | "生活費") => {
  switch (category) {
    case "収入":
      return incomeItems;
    case "支出":
      return expenditureItems;
    case "生活費":
      return livingItems;
    default:
      return [];
  }
};

  return (
    <div>
      {/* 新規入力ボタン */}
      <Button variant="contained" onClick={() => setOpen(true)}>
        新規入力
      </Button>

      {/* テーブル */}
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((h) => (
              <TableCell key={h.accessor}>{h.Headers}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
            {items.map((row) => {
                const expenditure = row.category === "支出" || row.category === "生活費" ? row.amount : 0;
                const income = row.category === "収入" ? row.amount : 0;
                const total = income - expenditure;

                return (
                <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{expenditure}</TableCell>
                    <TableCell>{income}</TableCell>
                    <TableCell style={{ color: total < 0 ? "red" : "black" }}>
                    {total}
                    </TableCell>
                </TableRow>
                );
            })}
        </TableBody>

      </Table>

      {/* 入力フォームダイアログ */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>家計簿入力</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>カテゴリ</InputLabel>
            <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as "収入" | "支出" | "生活費")}
            >
                <MenuItem value="収入">収入</MenuItem>
                <MenuItem value="支出">支出</MenuItem>
                <MenuItem value="生活費">生活費</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>費目名</InputLabel>
            <Select
                value={name}
                onChange={(e) => setName(e.target.value)}
            >
                {getItemsByCategory(category).map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="日付"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => {
                const value = e.target.value;
                setDate(value);
                // 月を自動計算してセット
                const monthValue = new Date(value).getMonth() + 1;
                setMonth(monthValue);
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            label={category === "収入" ? "収入金額" : "支出金額"} // ←カテゴリでラベル切り替え
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


