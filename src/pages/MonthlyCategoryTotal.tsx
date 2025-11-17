import React from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export type KakeiboItem = {
  id: number;
  date: string;   // "YYYY-MM-DD" 前提
  item: string;
  payment: string;
  money: number;
  memo?: string;
};

// 各月 × 各カテゴリの合計を計算
function getMonthlyCategoryTotals(items: KakeiboItem[]) {
  const totals: { [month: string]: { [category: string]: number } } = {};

  items.forEach((exp) => {
    const [y, m] = exp.date.split("-");
    const monthKey = `${y}-${m}`;
    if (!totals[monthKey]) totals[monthKey] = {};
    totals[monthKey][exp.item] = (totals[monthKey][exp.item] || 0) + exp.money;
  });

  return totals;
}

export default function MonthlyCategoryTotal() {
  const [items, setItems] = React.useState<KakeiboItem[]>([]);

  // 初回レンダリング時に localStorage から読み込む
  React.useEffect(() => {
    const saved = localStorage.getItem("items");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const totals = getMonthlyCategoryTotals(items);
  const months = Object.keys(totals).sort();
  const categories = Array.from(new Set(items.map((exp) => exp.item)));

  return (
    <Box maxWidth={"1200px"} sx={{ mx: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>月</TableCell>
            {categories.map((cat) => (
              <TableCell key={cat}>{cat}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {months.map((month) => (
            <TableRow key={month}>
              <TableCell>{month}</TableCell>
              {categories.map((cat) => (
                <TableCell key={cat}>
                  {totals[month][cat] || 0}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
