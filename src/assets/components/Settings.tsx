import { useEffect, useState } from "react";
import {
  getCardTypes,
  getPointTypes,
  saveCardTypes,
  savePointTypes,
  deleteCardType,
  deletePointType,
} from "../../db/indexedDB";
import { Box, Button, Stack, SxProps, TextField, Typography } from "@mui/material";
import ExpenseItemsSetting from "./ExpenseItemsSetting";

export const btnSx: SxProps = {mx:2,my:1,height:"40px"}

export default function Settings() {
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  const [pointTypes, setPointTypes] = useState<string[]>([]);
  const [newCard, setNewCard] = useState("");
  const [newPoint, setNewPoint] = useState("");

  // 初期読み込み
  useEffect(() => {
    const fetchData = async () => {
      setCardTypes(await getCardTypes());
      setPointTypes(await getPointTypes());
    };
    fetchData();
  }, []);

  // 追加
  const handleAddCard = async () => {
    const updated = [...cardTypes, newCard];
    setCardTypes(updated);
    await saveCardTypes(updated);
    setNewCard("");
  };

  const handleAddPoint = async () => {
    const updated = [...pointTypes, newPoint];
    setPointTypes(updated);
    await savePointTypes(updated);
    setNewPoint("");
  };

  // 削除
  const handleDeleteCard = async (type: string) => {
  const updated = await deleteCardType(type);
  setCardTypes(updated);
};

  const handleDeletePoint = async (type: string) => {
  const updated = await deletePointType(type);
  setPointTypes(updated);
};

  return (
    <Box mt={2} justifyItems="center">
      <Stack direction="row">
      <Box>
        <Typography variant="h5">カード種類</Typography>
        <TextField
          value={newCard}
          onChange={(e) => setNewCard(e.target.value)}
          placeholder="カード名を入力"
        />
        <Button variant="contained" sx={btnSx} onClick={handleAddCard}>追加</Button>
        <Box width="318px">
          {cardTypes.map((c,index) => (
              <Box
              key={`${c}-${index}`} 
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
              >
              <Typography>{c}</Typography>
              <Button
                  variant="contained"
                  color="error"
                  sx={btnSx}
                  onClick={() => handleDeleteCard(c)}
              >
                  削除
              </Button>
              </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="h5">ポイント種類</Typography>
        <TextField
          value={newPoint}
          onChange={(e) => setNewPoint(e.target.value)}
          placeholder="ポイント名を入力"
        />
        <Button variant="contained" sx={btnSx} onClick={handleAddPoint}>追加</Button>
        {pointTypes.map((p, index) => (
          <Box key={`${p}-${index}`} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography>{p}</Typography>
            <Button
              variant="contained"
              color="error"
              sx={btnSx}
              onClick={() => handleDeletePoint(p)}
            >
              削除
            </Button>
          </Box>
        ))}
      </Box>
      <ExpenseItemsSetting />
      </Stack>
    </Box>
  );
}
