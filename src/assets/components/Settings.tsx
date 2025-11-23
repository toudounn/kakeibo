import { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, Typography, Stack, SxProps } from "@mui/material";

export const btnSx:SxProps ={
    width:"50px",
    height:"30px"
}

export default function Settings() {
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  const [pointTypes, setPointTypes] = useState<string[]>([]);
  const [newCard, setNewCard] = useState("");
  const [newPoint, setNewPoint] = useState("");

  // 初期読み込み
  useEffect(() => {
    const storedCards = localStorage.getItem("cardTypes");
    const storedPoints = localStorage.getItem("pointTypes");
    if (storedCards) setCardTypes(JSON.parse(storedCards));
    if (storedPoints) setPointTypes(JSON.parse(storedPoints));
  }, []);

  // 保存関数
  const saveCardTypes = (types: string[]) => {
    setCardTypes(types);
    localStorage.setItem("cardTypes", JSON.stringify(types));
  };
  const savePointTypes = (types: string[]) => {
    setPointTypes(types);
    localStorage.setItem("pointTypes", JSON.stringify(types));
  };

  return (
    <Box p={2}>
      <Stack direction="row" spacing={5}>
        <Stack direction="column">
            <Typography variant="h6">カード種類設定</Typography>
            <Box display="flex" gap={1} mt={1} alignItems="center">
                <TextField
                  label="カード種類"
                  value={newCard}
                  onChange={(e) => setNewCard(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        if (newCard) {
                        saveCardTypes([...cardTypes, newCard]);
                        setNewCard("");
                      }
                    }}
                    sx={btnSx}
                >
                    追加
                </Button>
            </Box>
            <List>
                {cardTypes.map((c, i) => (
                <ListItem key={i}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box width={200}>
                            <Typography>{c}</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() =>
                                saveCardTypes(cardTypes.filter((_, idx) => idx !== i))
                            }
                            sx={btnSx}
                            >
                            削除
                        </Button>
                    </Stack>
                </ListItem>
                ))}
            </List>
        </Stack>
        <Stack direction="column">
            <Typography variant="h6">ポイント種類設定</Typography>
            <Box display="flex" gap={1} mt={1} alignItems="center">
                <TextField
                    label="ポイント種類"
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        if (newPoint) {
                            savePointTypes([...pointTypes, newPoint]);
                            setNewPoint("");
                        }
                    }}
                    sx={btnSx}
                >
                    追加
                </Button>
            </Box>
            <List>
                {pointTypes.map((p, i) => (
                    <ListItem key={i} >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box width={200}>
                                <Typography>{p}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                    savePointTypes(pointTypes.filter((_, idx) => idx !== i))
                                }
                                sx={btnSx}
                            >
                                削除
                            </Button>
                        </Stack>
                    </ListItem>
                ))}
            </List>
        </Stack>
      </Stack>
    </Box>
  );
}
