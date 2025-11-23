import { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from "@mui/material";
import { KakeiboItem } from "../../typs";
import { tableSx, tebleRowSx } from "../../pages/Category";

export default function PointSummary() {
  const [items, setItems] = useState<KakeiboItem[]>([]);
  const [pointTypes, setPointTypes] = useState<string[]>([]);

  useEffect(() => {
    // 家計簿データから「ポイント払い」のみ抽出
    const stored = localStorage.getItem("expenses");
    if (stored) {
      const parsed: KakeiboItem[] = JSON.parse(stored);
      setItems(parsed.filter((item) => item.payment === "ポイント"));
    }

    // 設定画面で保存したポイント種類を読み込み
    const storedPoints = localStorage.getItem("pointTypes");
    if (storedPoints) {
      setPointTypes(JSON.parse(storedPoints));
    }
  }, []);

  // 種類ごとの合計を計算
  const totalByType = (type: string) =>
    items.filter((i) => i.paymentType === type).reduce((sum, i) => sum + i.amount, 0);

  return (
    <Box m={2}>
      <Typography variant="h5">ポイント払い合計一覧</Typography>
      <Table sx={tableSx}>
        <TableHead>
          <TableRow sx={tebleRowSx}>
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
