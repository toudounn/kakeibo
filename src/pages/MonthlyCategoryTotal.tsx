import { Box, Table, TableBody, TableHead } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../assets/components/StyledTable";
import { Item } from "./GrandTotalTable";
import React from "react";



export default function MonthlyCategoryTotal({ data = [] }: { data?: Item[] }) {
  const [items, setItems] = React.useState<Item[]>(data);

function getMonthlyCategoryTotals(data: Item[]) {
  const totals: { [month: number]: { [category: string]: number } } = {};

  data.forEach((exp) => {
    exp.monthly.forEach((val, idx) => {
      const monthKey = idx + 1; // 1月〜12月
      if (!totals[monthKey]) totals[monthKey] = {};
      totals[monthKey][exp.category] = (totals[monthKey][exp.category] || 0) + val;
    });
  });

  return totals;
}


  React.useEffect(() => {
    if (!data || data.length === 0) {
      const saved = localStorage.getItem("items");
      if (saved) {
        try {
          const parsed: Item[] = JSON.parse(saved);
          setItems(parsed);
        } catch {
          console.error("localStorage のデータ形式が不正です");
        }
      }
    }
  }, [data]);

  const totals = getMonthlyCategoryTotals(items);
  const months = Object.keys(totals).map(Number).sort((a, b) => a - b);
  const categories = Array.from(new Set(items.map((exp) => exp.category)));

  return (
    <Box maxWidth={"1200px"} sx={{ mx: "auto" }}>
      <Table>
        <TableHead>
  <StyledTableRow>
    <StyledTableCell>月</StyledTableCell>
    {categories.map((cat) => (
      <StyledTableCell key={cat}>{cat}</StyledTableCell>
    ))}
  </StyledTableRow>
</TableHead>
<TableBody>
  {months.map((month) => (
    <StyledTableRow key={month}>
      <StyledTableCell>{month}月</StyledTableCell>
      {categories.map((cat) => (
        <StyledTableCell key={cat}>
          {totals[month]?.[cat] ?? 0}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  ))}
</TableBody>

      </Table>
    </Box>
  );
}
