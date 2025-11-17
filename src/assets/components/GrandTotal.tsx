import { Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

type Item = {
  Headers: string;
  monthly: number[];
};

// 2. 合計・平均を計算する関数
function getTotal(monthly: number[]) {
  return monthly.reduce((sum, val) => sum + val, 0);
}

function getAverage(monthly: number[]) {
  return Math.round(getTotal(monthly) / monthly.length);
}

// 3. GrandTotalTable コンポーネント
type Props = {
  grandTotalItem: { Headers: string }[];
  incomeExpenseItems: Item[];
  expenditureExpenseItems: Item[];
  livingExpensesItems: Item[];
};

export default function GrandTotalTable({
  grandTotalItem,
  incomeExpenseItems,
  expenditureExpenseItems,
  livingExpensesItems,
}: Props) {
  const renderRows = (items: Item[]) => (
    <>
      {items.map((item) => (
        <TableRow key={item.Headers}>
          <TableCell>{item.Headers}</TableCell>
          {item.monthly.map((val, idx) => (
            <TableCell key={idx}>{val}</TableCell>
          ))}
          <TableCell>{getTotal(item.monthly)}</TableCell>
          <TableCell>{getAverage(item.monthly)}</TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>月別費目別集計</Typography>
      <Table>
        <TableHead>
          <TableRow>
            {grandTotalItem.map((col) => (
              <TableCell key={col.Headers}>{col.Headers}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows(incomeExpenseItems)}
          {renderRows(expenditureExpenseItems)}
          {renderRows(livingExpensesItems)}
        </TableBody>
      </Table>
    </>
  );
}
