import { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from "@mui/material";
import { KakeiboItem } from "../../typs";
import { tableSx, tableRowSx } from "../../pages/Category";
import { getExpenses, getCardTypes, saveCardTypes } from "../../db/indexedDB";

export default function CardSummary() {
  const [items, setItems] = useState<KakeiboItem[]>([]);
  const [cardTypes, setCardTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 家計簿データから「カード払い」のみ抽出
        const expenses: KakeiboItem[] = await getExpenses();
        setItems(expenses.filter((item) => item.payment === "カード"));

        // 設定画面で保存したカード種類を読み込み
        let cards: string[] = await getCardTypes();

        // 初期値が空ならデフォルトを設定
        if (cards.length === 0) {
          cards = ["Visa", "MasterCard", "JCB"];
          await saveCardTypes(cards);
        }

        setCardTypes(cards);
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
      <Typography variant="h5">カード払い合計一覧</Typography>
      <Table sx={tableSx}>
        <TableHead>
          <TableRow sx={tableRowSx}>
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
