import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  SxProps,
  Box,
} from "@mui/material";
import { KakeiboItem } from "../typs";
import {
  incomeExpenseItems,
  expenditureExpenseItems,
  livingExpensesItems,
} from "../assets/util";
import BalanceCell from "../assets/components/BalanceCell";
import { getExpenses } from "../db/indexedDB";

export const totalLineSx: SxProps = {
  fontWeight: "bold",
  backgroundColor: "#e0f7fa",
};

export const tableRowSx: SxProps = {
  fontWeight: "bold",
  backgroundColor: "#e0e7faff",
};

export const tableSx: SxProps = {
  border: "1px solid black",
  borderCollapse: "collapse",
  tableLayout: "fixed", // 横幅を固定レイアウトに
  width: "100%", // 全体幅を固定
  "& td, & th": {
    border: "1px solid black",
    padding: "0px 4px", // ほぼ余白ゼロ
    whiteSpace: "nowrap", // 折り返し防止
    overflow: "hidden", // はみ出しを隠す
    textOverflow: "ellipsis", // 長い文字は「…」で省略
  },
  "& tr": {
    height: "20px", // Excel風に詰める
  },
};

export default function Category() {
  const [items, setItems] = useState<KakeiboItem[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const expenses: KakeiboItem[] = await getExpenses();
      setItems(expenses);
    } catch (e) {
      console.error("IndexedDBのデータ取得に失敗しました", e);
    }
  };

  fetchData();
}, []);

  // 月ごとの集計関数
  const calcMonthlyTotals = (name: string) => {
    const totals: number[] = Array(12).fill(0);
    items.forEach((item) => {
      if (item.name === name) {
        const monthIndex = item.month - 1;
        totals[monthIndex] += Number(item.amount);
      }
    });
    return totals;
  };

  // 行データを作成
  const makeRows = (source: { Headers: string; accessor: string }[]) =>
    source.map((s) => {
      const monthly = calcMonthlyTotals(s.Headers);
      const sum = monthly.reduce((a, b) => a + b, 0);
      return { Headers: s.Headers, monthly, sum };
    });

  const incomeRows = makeRows(incomeExpenseItems);
  const expenditureRows = makeRows(expenditureExpenseItems);
  const livingRows = makeRows(livingExpensesItems);

  // 各セクションの月別合計
  const sectionTotals = (
    rows: { Headers: string; monthly: number[]; sum: number }[]
  ) => {
    const monthly = Array(12).fill(0);
    rows.forEach((row) => {
      row.monthly.forEach((val, i) => {
        monthly[i] += val;
      });
    });
    const sum = monthly.reduce((a, b) => a + b, 0);
    return { monthly, sum };
  };

  const incomeTotal = sectionTotals(incomeRows);
  const expenditureTotal = sectionTotals(expenditureRows);
  const livingTotal = sectionTotals(livingRows);

  // 残高 = 収入合計 − 支出合計
  const balanceMonthly = incomeTotal.monthly.map(
    (val, i) => val - expenditureTotal.monthly[i]
  );
  const balanceSum = incomeTotal.sum - expenditureTotal.sum;

  // 共通テーブル描画関数（平均列を追加）
  const renderTable = (
    title: string,
    rows: { Headers: string; monthly: number[]; sum: number }[],
    total?: { monthly: number[]; sum: number }
  ) => (
    <>
      <Typography variant="h6" sx={{ mt: 3 }}>
        {title}
      </Typography>
      <Table sx={tableSx}>
        <TableHead>
          <TableRow sx={tableRowSx}>
            <TableCell>項目</TableCell>
            {Array.from({ length: 12 }, (_, i) => (
              <TableCell key={i}>{i + 1}月</TableCell>
            ))}
            <TableCell>合計</TableCell>
            <TableCell>平均</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.Headers}>
              <TableCell>{row.Headers}</TableCell>
              {row.monthly.map((val, i) => (
                <TableCell key={i}>{val}</TableCell>
              ))}
              <TableCell>{row.sum}</TableCell>
              <TableCell>{Math.round(row.sum / 12)}</TableCell>
            </TableRow>
          ))}
          {total && (
            <TableRow sx={totalLineSx}>
              <TableCell>月別合計</TableCell>
              {total.monthly.map((val, i) => (
                <TableCell key={i}>{val}</TableCell>
              ))}
              <TableCell>{total.sum}</TableCell>
              <TableCell>{Math.round(total.sum / 12)}</TableCell> {/* 合計の平均 */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );

  return (
    <Box m={2} className="table-wrapper">
      <Typography variant="h5">年間</Typography>
      {renderTable("収入", incomeRows, incomeTotal)}
      {renderTable("支出", expenditureRows, expenditureTotal)}
      {renderTable("生活費", livingRows, livingTotal)}

      <Typography variant="h6" sx={{ mt: 3 }}>
        残高
      </Typography>
      <Table sx={tableSx}>
        <TableHead>
          <TableRow sx={tableRowSx}>
            <TableCell>項目</TableCell>
            {Array.from({ length: 12 }, (_, i) => (
              <TableCell key={i}>{i + 1}月</TableCell>
            ))}
            <TableCell>合計</TableCell>
            <TableCell>平均</TableCell> {/* 平均列を追加 */}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={totalLineSx}>
            <TableCell>収入-支出</TableCell>
            {balanceMonthly.map((val, i) => (
              <BalanceCell key={i} value={val} />
            ))}
            <BalanceCell value={balanceSum} />
            <BalanceCell value={Math.round(balanceSum / balanceMonthly.length)} /> {/* 整数に丸める */}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
