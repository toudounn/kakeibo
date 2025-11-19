import { Box, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogContent, DialogTitle, Button, DialogActions, TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { KakeiboItem, AllTotalProps } from "../typs";

function AllTotal({ items, onUpdate,onDelete }: AllTotalProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KakeiboItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // 削除用

 // 編集ダイアログを開く
  const handleEditOpen = (item: KakeiboItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  // 入力変更
  const handleChange = (field: keyof KakeiboItem, value: any) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
  };

  // 更新処理
  const handleSave = () => {
    if (selectedItem) {
      onUpdate(selectedItem);
      setOpenDialog(false);
      setSnackbarOpen(true);
    }
  };

  // 削除確認ダイアログを開く
  const handleDeleteOpen = (item: KakeiboItem) => {
    setSelectedItem(item);
    setConfirmOpen(true);
  };

  // 削除確定
  const handleConfirmDelete = () => {
    if (selectedItem) {
      onDelete(selectedItem.id);
      setConfirmOpen(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // 月ごとの集計を計算
const monthlySummary = items.reduce((acc, item) => {
  const month = item.date.slice(0, 7); // YYYY-MM
  if (!acc[month]) {
    acc[month] = { income: 0, expense: 0 };
  }
  if (item.category === "収入") {
    acc[month].income += item.money;
  } else {
    acc[month].expense += item.money;
  }
  return acc;
}, {} as Record<string, { income: number; expense: number }>);

  return (
    <>
      <Box maxWidth={"1200px"} sx={{ mx: "auto" }}>
       {/* 一覧表示 */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>カテゴリ</TableCell>
            <TableCell>日付</TableCell>
            <TableCell>項目</TableCell>
            <TableCell>支払方法</TableCell>
            <TableCell>金額</TableCell>
            <TableCell>メモ</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.item}</TableCell>
              <TableCell>{item.payment}</TableCell>
              <TableCell>{item.money}</TableCell>
              <TableCell>{item.memo}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => handleEditOpen(item)}
                  sx={{ mr: 1 }}
                >
                  編集
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteOpen(item)}
                >
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 編集ダイアログ */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>編集</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <TextField
                margin="dense"
                label="日付"
                type="date"
                fullWidth
                value={selectedItem.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              <TextField
                margin="dense"
                label="項目"
                fullWidth
                value={selectedItem.item}
                onChange={(e) => handleChange("item", e.target.value)}
              />
              <TextField
                margin="dense"
                label="支払方法"
                fullWidth
                value={selectedItem.payment}
                onChange={(e) => handleChange("payment", e.target.value)}
              />
              <TextField
                margin="dense"
                label="金額"
                type="number"
                fullWidth
                value={selectedItem.money}
                onChange={(e) => handleChange("money", Number(e.target.value))}
              />
              <TextField
                margin="dense"
                label="メモ"
                fullWidth
                value={selectedItem.memo || ""}
                onChange={(e) => handleChange("memo", e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>
          {selectedItem ? (
            <>
              <p>
                本当に <strong>{selectedItem.item}</strong>（{selectedItem.money}円）
                を削除しますか？
              </p>
              <p>日付: {selectedItem.date}</p>
              <p>支払方法: {selectedItem.payment}</p>
              {selectedItem.memo && <p>メモ: {selectedItem.memo}</p>}
            </>
          ) : (
            <p>削除対象が選択されていません。</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>キャンセル</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            削除する
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} variant="filled">
          操作が完了しました
        </Alert>
      </Snackbar>
      </Box>
      {/* 月ごとの集計表示 */}
<h2>月ごとの集計</h2>
<Table>
  <TableHead>
    <TableRow>
      <TableCell>月</TableCell>
      <TableCell>収入合計</TableCell>
      <TableCell>支出合計</TableCell>
      <TableCell>差引</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {Object.entries(monthlySummary).map(([month, { income, expense }]) => (
      <TableRow key={month}>
        <TableCell>{month}</TableCell>
        <TableCell>{income}</TableCell>
        <TableCell>{expense}</TableCell>
        <TableCell>{income - expense}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
    </>
  );
}

export default AllTotal;
