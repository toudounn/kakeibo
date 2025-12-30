import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  SxProps,
} from "@mui/material";
import { useEffect, useState,useRef } from "react";
import { getExpenses } from "../db/indexedDB";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// IndexedDBから取得するデータ型
type KakeiboItem = {
  name: string;
  month: number;
  amount: number;
};

export const totalLineSx = {
  fontWeight: "bold",
  backgroundColor: "#e0f7fa",
};

export const tableRowSx = {
  fontWeight: "bold",
  backgroundColor: "#e0e7faff",
};

export const tableSx = {
  border: "1px solid black",
  borderCollapse: "collapse",
  tableLayout: "auto",
  width: "100%",
  "& td, & th": {
    border: "1px solid black",
    padding: "0px 2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: "60px",
  },
  "& tr": {
    height: "20px",
  },
};

export const messageSx :SxProps ={
          px: 1,
          my: 1,
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          borderRadius: 2,
          color: "#856404",
          fontWeight: "bold",
          textAlign: "center",
};

export default function Category() {
  const [items, setItems] = useState<KakeiboItem[]>([]);
  const [incomeItems, setIncomeItems] = useState<any[]>([]);
const [expenditureItems, setExpenditureItems] = useState<any[]>([]);
const [livingItems, setLivingItems] = useState<any[]>([]);

useEffect(() => {
  const savedIncome = localStorage.getItem("incomeItems");
  const savedExpenditure = localStorage.getItem("expenditureItems");
  const savedLiving = localStorage.getItem("livingItems");

  if (savedIncome) setIncomeItems(JSON.parse(savedIncome));
  if (savedExpenditure) setExpenditureItems(JSON.parse(savedExpenditure));
  if (savedLiving) setLivingItems(JSON.parse(savedLiving));
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // IndexedDBからデータ取得する処理（仮）
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

  const incomeRows = makeRows(incomeItems);
const expenditureRows = makeRows(expenditureItems);
const livingRows = makeRows(livingItems);


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

  // ★ グラフページ用に保存
  useEffect(() => {
  localStorage.setItem(
    "graphData",
    JSON.stringify({
      incomeMonthly: incomeTotal.monthly,
      expenditureMonthly: expenditureTotal.monthly,
      balanceMonthly,
      incomeSum: incomeTotal.sum,
      expenditureSum: expenditureTotal.sum,
      balanceSum,
      expenditureRows: expenditureRows.map((r) => ({
        Headers: r.Headers,
        sum: r.sum,
        monthly: r.monthly,
      })),
    })
  );
}, [incomeTotal, expenditureTotal, balanceMonthly, balanceSum, expenditureRows]);


  // 共通テーブル描画関数
  const renderTable = (
    title: string,
    rows: { Headers: string; monthly: number[]; sum: number }[],
    total?: { monthly: number[]; sum: number }
  ) => (
    <>
      <Typography variant="h6" >
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
              <TableCell>{Math.round(total.sum / 12)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );

  const tableRef = useRef<HTMLDivElement>(null);

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

  // PDF出力処理
  const handleExportPDF = async () => {
  if (!tableRef.current) return;

  // ★ 元の幅を保存
  const originalWidth = tableRef.current.style.width;

  // ★ PDF 用に一時的に幅を広げる（A4 横向き相当）
  tableRef.current.style.width = "1200px";

  // ★ 少し待ってレイアウトを反映
  await new Promise((resolve) => setTimeout(resolve, 100));

  const pdf = new jsPDF("landscape", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();

  const canvas = await html2canvas(tableRef.current, {
    scale: 2, // ← 高解像度でキャプチャ
  });

  const imgData = canvas.toDataURL("image/png");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pageWidth - 20;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

  pdf.save("CategorySummary.pdf");

  // ★ 幅を元に戻す
  tableRef.current.style.width = originalWidth;
};


  return (
    <Box m={2}>
      <Box
        sx={messageSx}
      >
        横向きにすると見やすくなります
      </Box>
      <Button variant="contained" color="primary" onClick={handleExportPDF}>
        PDFに保存
      </Button>

      <Box ref={tableRef} sx={{ width: "100%", overflowX: "visible" }}>
        <Box className="table-wrapper">
          {renderTable("収入", incomeRows, incomeTotal)}
          {renderTable("固定費", expenditureRows, expenditureTotal)}
          {renderTable("生活費", livingRows, livingTotal)}

          <Typography variant="h6">残高</Typography>

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
              <TableRow sx={totalLineSx}>
                <TableCell>収入-支出</TableCell>
                {balanceMonthly.map((val, i) => (
                  <TableCell key={i}>{val}</TableCell>
                ))}
                <TableCell>{balanceSum}</TableCell>
                <TableCell>
                  {Math.round(balanceSum / balanceMonthly.length)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
