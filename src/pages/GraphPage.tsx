import { Box, Typography, Tabs, Tab } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

type ExpenditureRow = { Headers: string; monthly: number[]; sum: number };

export default function GraphPage() {
  const data = localStorage.getItem("graphData");
  if (!data) return <Typography>データがありません</Typography>;

  const parsed = JSON.parse(data) as {
    incomeMonthly: number[];
    expenditureMonthly: number[];
    balanceMonthly: number[];
    incomeSum: number;
    expenditureSum: number;
    balanceSum: number;
    expenditureRows: ExpenditureRow[];
  };

  const {
    incomeMonthly = [],
    expenditureMonthly = [],
    balanceMonthly = [],
    incomeSum = 0,
    expenditureSum = 0,
    balanceSum = 0,
    expenditureRows = [],
  } = parsed;

  // 月別データ
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}月`,
    income: incomeMonthly[i] ?? 0,
    expenditure: expenditureMonthly[i] ?? 0,
    balance: balanceMonthly[i] ?? 0,
  }));

  // 年間合計データ
  const annualData = [
    { name: "収入", value: incomeSum },
    { name: "支出", value: expenditureSum },
    { name: "残高", value: balanceSum },
  ];

  // 年間支出項目別円グラフ
  const annualPieData = expenditureRows.map((row) => ({
    name: row.Headers,
    value: row.sum ?? 0,
  }));

// 月別支出項目別円グラフデータ
const monthlyPieData = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}月`,
  data: expenditureRows.map((row) => ({
    name: row.Headers,
    value: row.monthly?.[i] ?? 0,  // ← 安全に参照
  })),
}));

  // タブ切り替え用 state
  const [tabIndex, setTabIndex] = useState(0);

  // 安全に参照
  const currentMonthData =
    monthlyPieData.length > tabIndex ? monthlyPieData[tabIndex] : { month: "", data: [] };
console.log("expenditureRows", expenditureRows);
console.log("monthlyPieData", monthlyPieData);

  return (
    <Box m={2}>
      <Typography variant="h5">月別収入・支出・残高グラフ</Typography>
      <LineChart width={800} height={300} data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#0088FE" name="収入" />
        <Line type="monotone" dataKey="expenditure" stroke="#FF8042" name="支出" />
        <Line type="monotone" dataKey="balance" stroke="#00C49F" name="残高" />
      </LineChart>

      <Typography variant="h5" mt={4}>年間合計</Typography>
      <BarChart width={600} height={300} data={annualData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>

      <Typography variant="h5" mt={4}>年間支出項目別円グラフ</Typography>
      <PieChart width={600} height={400}>
        <Pie
          data={annualPieData}
          cx={300}
          cy={200}
          labelLine={false}
          label={(props) =>
            `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
          }
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {annualPieData.map((_, index: number) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <Typography variant="h5" mt={4}>月別支出項目別円グラフ</Typography>
      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {monthlyPieData.map((m, idx) => (
          <Tab key={idx} label={m.month} />
        ))}
      </Tabs>

      {/* 選択された月の円グラフを表示 */}
     <Box mt={2}>
        {/* 月別支出がゼロかどうか判定 */}
        {currentMonthData.data.every((d) => d.value === 0) ? (
          <Typography>この月は支出がありません</Typography>
        ) : (
          <PieChart width={600} height={400}>
            <Pie
              data={currentMonthData.data}
              cx={300}
              cy={200}
              labelLine={false}
              label={(props) =>
                `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {currentMonthData.data.map((_, index: number) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </Box>
    </Box>
  );
}
