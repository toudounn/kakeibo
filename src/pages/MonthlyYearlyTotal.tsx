import React from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";

type KakeiboItem = {
  id: number;
  date: string;   // "YYYY-MM-DD"
  item: string;
  payment: string;
  money: number;
};

function getMonthlyTotals(items: KakeiboItem[]) {
  const totals: { [month: string]: number } = {};
  items.forEach((exp) => {
    const [y, m] = exp.date.split("-");
    const monthKey = `${y}-${m}`;
    totals[monthKey] = (totals[monthKey] || 0) + exp.money;
  });
  return totals;
}

function getYearlyTotals(items: KakeiboItem[]) {
  const totals: { [year: string]: number } = {};
  items.forEach((exp) => {
    const [y] = exp.date.split("-");
    totals[y] = (totals[y] || 0) + exp.money;
  });
  return totals;
}

export default function MonthlyYearlyTotal() {
  const [items, setItems] = React.useState<KakeiboItem[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem("items");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const monthlyTotals = getMonthlyTotals(items);
  const yearlyTotals = getYearlyTotals(items);

  const months = Object.keys(monthlyTotals).sort();
  const years = Object.keys(yearlyTotals).sort();

  return (
    <Box maxWidth={"800px"} sx={{ mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>月別・年別合計</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>期間</TableCell>
            <TableCell>合計金額</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {months.map((month) => (
            <TableRow key={month}>
              <TableCell>{month}</TableCell>
              <TableCell>{monthlyTotals[month]}</TableCell>
            </TableRow>
          ))}
          {years.map((year) => (
            <TableRow key={year}>
              <TableCell>{year}</TableCell>
              <TableCell>{yearlyTotals[year]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
