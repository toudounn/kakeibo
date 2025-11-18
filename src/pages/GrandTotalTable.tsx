import { Typography, Table, TableHead, TableBody, SxProps, TableContainer, Paper } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../assets/components/StyledTable";

export type Item = {
  Headers: string;
  monthly: number[]; // 12ヶ月分の金額
  category:string;
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
        <StyledTableRow key={item.Headers} sx={{backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
          <StyledTableCell sx={cellSx}>{item.Headers}</StyledTableCell>
          {item.monthly.map((val, idx) => (
            <StyledTableCell key={idx} sx={cellSx}>{val}</StyledTableCell>
          ))}
          <StyledTableCell sx={cellSx}>{getTotal(item.monthly)}</StyledTableCell>
          <StyledTableCell sx={cellSx}>{getAverage(item.monthly)}</StyledTableCell>
        </StyledTableRow>
      ))}
      <StyledTableRow>
        <StyledTableCell sx={cellSx}>合計</StyledTableCell>
        {Array.from({ length: 12 }).map((_, idx) => (
          <StyledTableCell key={idx} sx={cellSx}>
            {items.reduce((sum, it) => sum + it.monthly[idx], 0)}
          </StyledTableCell>
        ))}
        <StyledTableCell sx={cellSx}>
          {items.reduce((sum, it) => sum + getTotal(it.monthly), 0)}
        </StyledTableCell>
        <StyledTableCell sx={cellSx}>
          {Math.round(
            items.reduce((sum, it) => sum + getTotal(it.monthly), 0) / 12
          )}
        </StyledTableCell>
      </StyledTableRow>
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
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2, // 角を丸めたい場合
        }}
      >
      <Table>
        <TableHead>
          <StyledTableRow sx={{ backgroundColor: "#e0e0e0" }}>
            {grandTotalItem.map((col) => (
              <StyledTableCell key={col.Headers} sx={cellSx}>{col.Headers}</StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {renderRows(incomeExpenseItems)}
          {renderRows(expenditureExpenseItems)}
          {renderRows(livingExpensesItems)}

          {/* 年合計（収入−支出） */}
          <StyledTableRow>
            <StyledTableCell sx={cellSx} ><strong>年合計（収入−支出）</strong></StyledTableCell>
            <StyledTableCell colSpan={grandTotalItem.length - 1} sx={{ color: totalColor, ...cellSx }}>
            <strong>{yearlyGrandTotal}</strong>
          </StyledTableCell>

          </StyledTableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </>
  );
}
