import { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Select, MenuItem, SxProps } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { KakeiboItem } from "../typs";

ChartJS.register(ArcElement, Tooltip, Legend);

const pieSx:SxProps = { width: "100%",maxWidth:"300px" }

export default function GraphPage() {
  const [items, setItems] = useState<KakeiboItem[]>([]);
  const [tab, setTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const options = {
  responsive: true,
  // アスペクト比を維持
  maintainAspectRatio: true, 
};

  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // 月ごと集計（選択した月のみ）
  const monthlyTotals: Record<string, number> = {};
  items
    .filter((item) => new Date(item.date).getMonth() + 1 === selectedMonth)
    .forEach((item) => {
      monthlyTotals[item.category] = (monthlyTotals[item.category] || 0) + item.amount;
    });

  const monthlyData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        data: Object.values(monthlyTotals),
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
      },
    ],
  };

  // 年ごと集計（選択した年のみ）
  const yearlyTotals: Record<string, number> = {};
  items
    .filter((item) => new Date(item.date).getFullYear() === selectedYear)
    .forEach((item) => {
      yearlyTotals[item.category] = (yearlyTotals[item.category] || 0) + item.amount;
    });

  const yearlyData = {
    labels: Object.keys(yearlyTotals),
    datasets: [
      {
        data: Object.values(yearlyTotals),
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
      },
    ],
  };

  return (
    <Box m={2}>
      <Typography variant="h5">費目グラフ</Typography>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label="月ごと" />
        <Tab label="年ごと" />
      </Tabs>


      {tab === 0 && (
        <>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            sx={{ my: 2 }}
          >
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}月
              </MenuItem>
            ))}
          </Select>
          <Box sx={pieSx}>
            <Pie data={monthlyData} options={options} />
          </Box>

        </>
      )}

      {tab === 1 && (
        <>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            sx={{ mb: 2 }}
          >
            {[...new Set(items.map((i) => new Date(i.date).getFullYear()))].map((year) => (
              <MenuItem key={year} value={year}>
                {year}年
              </MenuItem>
            ))}
          </Select>
          <Box sx={pieSx}>
            <Pie data={yearlyData} options={options} />
          </Box>
        </>
      )}
    </Box>
  );
}
