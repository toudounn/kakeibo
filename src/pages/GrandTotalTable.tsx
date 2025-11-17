import { Typography, Table, TableHead, TableRow, TableCell, TableBody, SxProps } from "@mui/material";

type Item = {
  Headers: string;
  monthly: number[]; // 12ヶ月分の金額
};

function getTotal(monthly: number[]) {
  return monthly.reduce((sum, val) => sum + val, 0);
}

function getAverage(monthly: number[]) {
  return Math.round(getTotal(monthly) / monthly.length);
}

type Props = {
  grandTotalItem: { Headers: string }[];
  incomeExpenseItems: Item[];
  expenditureExpenseItems: Item[];
  livingExpensesItems: Item[];
};

const cellSx:SxProps={
    borderRight: "1px solid #ccc", "&:last-child": { borderRight: 0 } 
}


export default function GrandTotalTable({
  grandTotalItem,
  incomeExpenseItems,
  expenditureExpenseItems,
  livingExpensesItems,
}: Props) {
  const renderRows = (items: Item[]) => (
    <>
      {items.map((item,index) => (
        <TableRow key={item.Headers} sx={{backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
          <TableCell sx={cellSx}>{item.Headers}</TableCell>
          {item.monthly.map((val, idx) => (
            <TableCell key={idx} sx={cellSx}>{val}</TableCell>
          ))}
          <TableCell sx={cellSx}>{getTotal(item.monthly)}</TableCell>
          <TableCell sx={cellSx}>{getAverage(item.monthly)}</TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell sx={cellSx}>合計</TableCell>
        {Array.from({ length: 12 }).map((_, idx) => (
          <TableCell key={idx} sx={cellSx}>
            {items.reduce((sum, it) => sum + it.monthly[idx], 0)}
          </TableCell>
        ))}
        <TableCell sx={cellSx}>
          {items.reduce((sum, it) => sum + getTotal(it.monthly), 0)}
        </TableCell>
        <TableCell sx={cellSx}>
          {Math.round(
            items.reduce((sum, it) => sum + getTotal(it.monthly), 0) / 12
          )}
        </TableCell>
      </TableRow>
    </>
  );

  // 年合計（収入−支出）
  const yearlyIncome = incomeExpenseItems.reduce((sum, it) => sum + getTotal(it.monthly), 0);
  const yearlyExpenditure = expenditureExpenseItems.reduce((sum, it) => sum + getTotal(it.monthly), 0);
  const yearlyLiving = livingExpensesItems.reduce((sum, it) => sum + getTotal(it.monthly), 0);
  const yearlyGrandTotal = yearlyIncome - (yearlyExpenditure + yearlyLiving);

  // 色分け（赤字なら赤、黒字なら緑）
  const totalColor = yearlyGrandTotal < 0 ? "red" : "green";

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>月別費目別集計</Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
            {grandTotalItem.map((col) => (
              <TableCell key={col.Headers} sx={cellSx}>{col.Headers}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows(incomeExpenseItems)}
          {renderRows(expenditureExpenseItems)}
          {renderRows(livingExpensesItems)}

          {/* 年合計（収入−支出） */}
          <TableRow>
            <TableCell sx={cellSx} ><strong>年合計（収入−支出）</strong></TableCell>
            <TableCell colSpan={13} sx={{ color: totalColor, ...cellSx }}>
              <strong>{yearlyGrandTotal}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
