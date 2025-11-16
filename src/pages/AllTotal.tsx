import { Box, Table, TableHead, TableRow, TableCell, TableBody, Stack } from "@mui/material";
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
import { Bar, Line, Pie } from "react-chartjs-2";

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

export type KakeiboItem = {
  id: number;
  date: string;   // "YYYY-MM-DD" 前提
  item: string;
  payment: string;
  money: number;
  memo?: string;
};

type Props = {
  items: KakeiboItem[];
};

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

function AllTotal({ items }: Props) {
  return (
    <>
      <Box maxWidth={"1200px"} sx={{ mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>日付</TableCell>
              <TableCell>項目</TableCell>
              <TableCell>支払方法</TableCell>
              <TableCell>金額</TableCell>
              <TableCell>メモ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {/* <TableCell>{item.id}</TableCell> */}
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
<Stack direction="row">
      <Box maxWidth={"800px"} sx={{ mx: "auto", mt: 4 }}>
        <MonthlyBarChart items={items} />
      </Box>
      <Box maxWidth={"800px"} sx={{ mx: "auto", mt: 4 }}>
        <MonthlyLineChart items={items} />
      </Box>
      {/* </Stack>
      <Stack direction="row"> */}
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
