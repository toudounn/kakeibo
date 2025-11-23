import { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from "@mui/material";
import { KakeiboItem } from "../../typs";
import { tableSx, tebleRowSx } from "../../pages/Category";

export default function CardSummary() {
  const [items, setItems] = useState<KakeiboItem[]>([]);
  const [cardTypes, setCardTypes] = useState<string[]>([]);

  useEffect(() => {
    // 家計簿データから「カード払い」のみ抽出
    const stored = localStorage.getItem("expenses");
    if (stored) {
      const parsed: KakeiboItem[] = JSON.parse(stored);
      setItems(parsed.filter((item) => item.payment === "カード"));
    }

    // 設定画面で保存したカード種類を読み込み
    const storedCards = localStorage.getItem("cardTypes");
    if (storedCards) {
      setCardTypes(JSON.parse(storedCards));
    }
  }, []);

  // 種類ごとの合計を計算
  const totalByType = (type: string) =>
    items.filter((i) => i.paymentType === type).reduce((sum, i) => sum + i.amount, 0);

  return (
    <Box m={2}>
      <Typography variant="h5">カード払い合計一覧</Typography>
      <Table sx={tableSx}>
        <TableHead>
          <TableRow sx={tebleRowSx}>
            <TableCell>カード種類</TableCell>
            <TableCell>合計</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cardTypes.map((type) => (
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
