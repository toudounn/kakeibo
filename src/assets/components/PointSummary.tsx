import { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from "@mui/material";
import { KakeiboItem } from "../../typs";
import { tableSx, tableRowSx } from "../../pages/Category";
import { getExpenses, getPointTypes } from "../../db/indexedDB";

export default function PointSummary() {
  const [items, setItems] = useState<KakeiboItem[]>([]);
  const [pointTypes, setPointTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 家計簿データから「ポイント払い」のみ抽出
        const expenses: KakeiboItem[] = await getExpenses();
        setItems(expenses.filter((item) => item.payment === "ポイント"));

        // 設定画面で保存したポイント種類を読み込み
        const points: string[] = await getPointTypes();
        setPointTypes(points);
      } catch (e) {
        console.error("IndexedDBからのデータ取得に失敗しました", e);
      }
    };

    fetchData();
  }, []);

  // 種類ごとの合計を計算
  const totalByType = (type: string) =>
    items.filter((i) => i.paymentType === type).reduce((sum, i) => sum + i.amount, 0);

  return (
    <Box m={2}>
      <Typography variant="h5">ポイント払い合計一覧</Typography>
      <Table sx={tableSx}>
        <TableHead>
          <TableRow sx={tableRowSx}>
            <TableCell>ポイント種類</TableCell>
            <TableCell>合計</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pointTypes.map((type) => (
            <TableRow key={type}>
              <TableCell>{type}</TableCell>
              <TableCell>{totalByType(type)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
