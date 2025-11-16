import { Box, Table, TableHead, TableRow, TableCell, TableBody, Stack, Dialog, DialogContent, DialogTitle, Button, DialogActions, TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { KakeiboItem, AllTotalProps } from "../typs";

// Chart.js の登録は一度だけ
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// 共通オプション（レスポンシブ＆縦横比固定解除）
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// YYYY-MM キーを作って合計（ラベルは昇順でソート）
function getMonthlyTotals(items: KakeiboItem[]) {
  const totals: Record<string, number> = {};
  for (const exp of items) {
    // 安定のため date を文字列から直接分解
    const [y, m] = exp.date.split("-"); // "YYYY", "MM", "DD"
    const key = `${y}-${m}`; // 例: "2025-11"
    totals[key] = (totals[key] ?? 0) + Number(exp.money || 0);
  }
  // ラベルを時系列でソート
  const sortedKeys = Object.keys(totals).sort(
    (a, b) => new Date(`${a}-01`).getTime() - new Date(`${b}-01`).getTime()
  );
  // ソート済みで返す
  const sorted: Record<string, number> = {};
  for (const k of sortedKeys) sorted[k] = totals[k];
  return sorted;
}

// カテゴリ別合計
function getCategoryTotals(items: KakeiboItem[]) {
  const totals: Record<string, number> = {};
  for (const exp of items) {
    totals[exp.item] = (totals[exp.item] ?? 0) + Number(exp.money || 0);
  }
  return totals;
}

// 支払方法別合計
function getPaymentTotals(items: KakeiboItem[]) {
  const totals: Record<string, number> = {};
  for (const exp of items) {
    totals[exp.payment] = (totals[exp.payment] ?? 0) + Number(exp.money || 0);
  }
  return totals;
}

// 棒グラフ（月ごとの合計）
function MonthlyBarChart({ items }: { items: KakeiboItem[] }) {
  const totals = getMonthlyTotals(items);
  const labels = Object.keys(totals);
  const data = Object.values(totals);

  const chartData = {
    labels,
    datasets: [
      {
        label: "月ごとの支出合計",
        data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div style={{ height: 400 }}>
      <Bar key={labels.join(",")} data={chartData} options={chartOptions} />
    </div>
  );
}

// 折れ線グラフ（月ごとの推移）
function MonthlyLineChart({ items }: { items: KakeiboItem[] }) {
  const totals = getMonthlyTotals(items);
  const labels = Object.keys(totals);
  const data = Object.values(totals);

  const chartData = {
    labels,
    datasets: [
      {
        label: "月ごとの支出推移",
        data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div style={{ height: 400 }}>
      <Line key={labels.join(",")} data={chartData} options={chartOptions} />
    </div>
  );
}

// 円グラフ（カテゴリ別）
function CategoryPieChart({ items }: { items: KakeiboItem[] }) {
  const totals = getCategoryTotals(items);
  const labels = Object.keys(totals);
  const data = Object.values(totals);

  const chartData = {
    labels,
    datasets: [
      {
        label: "カテゴリ別支出割合",
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  return (
    <div style={{ height: 400 }}>
      <Pie key={labels.join(",")} data={chartData} options={chartOptions} />
    </div>
  );
}

// 円グラフ（支払方法別）
function PaymentPieChart({ items }: { items: KakeiboItem[] }) {
  const totals = getPaymentTotals(items);
  const labels = Object.keys(totals);
  const data = Object.values(totals);

  const chartData = {
    labels,
    datasets: [
      {
        label: "支払方法別支出割合",
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",   // 現金
          "rgba(54, 162, 235, 0.6)",   // クレジットカード
          "rgba(255, 206, 86, 0.6)",   // 電子マネー
          "rgba(75, 192, 192, 0.6)",   // その他
        ],
      },
    ],
  };

  return (
    <div style={{ height: 400 }}>
      <Pie key={labels.join(",")} data={chartData} options={chartOptions} />
    </div>
  );
}

function AllTotal({ items, onUpdate,onDelete }: AllTotalProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KakeiboItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // 削除用
const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false); // 更新用

  const handleRowClick = (item: KakeiboItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleChange = (field: keyof KakeiboItem, value: string | number) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
  };

  // 保存処理
const handleSave = () => {
  if (selectedItem) {
    onUpdate(selectedItem);
    setUpdateSnackbarOpen(true); // ← 更新完了時にSnackbarを開く
  }
  handleClose();
};

  // 削除確認ダイアログを開く
  const handleDeleteClick = () => {
    setConfirmOpen(true); 
  };

  // 削除確定時
const handleConfirmDelete = () => {
  if (selectedItem) {
    onDelete(selectedItem.id);
    setSnackbarOpen(true); // ← 開く
  }
  setConfirmOpen(false);
  handleClose();
};

// Snackbar 閉じる処理（clickaway無視）
const handleSnackbarClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === "clickaway") return;
  setSnackbarOpen(false);
  setUpdateSnackbarOpen(false);
};

  return (
    <>
      <Box maxWidth={"1200px"} sx={{ mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日付</TableCell>
              <TableCell>項目</TableCell>
              <TableCell>支払方法</TableCell>
              <TableCell>金額</TableCell>
              <TableCell>メモ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => handleRowClick(item)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.payment}</TableCell>
                <TableCell>{item.money}</TableCell>
                <TableCell>{item.memo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

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
          <Button onClick={handleClose} variant="outlined">キャンセル</Button>
          <Button onClick={handleDeleteClick} variant="contained" color="error">
            削除
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            保存
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
          削除しました
        </Alert>
      </Snackbar>
      {/* 更新Snackbar */}
  <Snackbar
    open={updateSnackbarOpen}
    autoHideDuration={3000}
    onClose={handleSnackbarClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert severity="info" onClose={() => setUpdateSnackbarOpen(false)} variant="filled">
      更新しました
    </Alert>
  </Snackbar>

      {/* グラフ群 */}
      <Stack direction="row" flexWrap="wrap">
        <Box maxWidth={"800px"} sx={{ mx: "auto", mt: 4 }}>
          <MonthlyBarChart items={items} />
        </Box>
        <Box maxWidth={"800px"} sx={{ mx: "auto", mt: 4 }}>
          <MonthlyLineChart items={items} />
        </Box>
        </Stack>
        <Stack direction="row">
        <Box maxWidth={"800px"} sx={{ mx: "auto", mt: 4 }}>
          <CategoryPieChart items={items} />
        </Box>
        <Box maxWidth={"800px"} sx={{ mx: "auto", mt: 4 }}>
          <PaymentPieChart items={items} />
        </Box>
      </Stack>
    </>
  );
}

export default AllTotal;
