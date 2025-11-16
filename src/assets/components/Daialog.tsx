import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Stack,
} from "@mui/material";
import SelectLabels from "./Select";
import SelectPayments from "./Select_payment";

// 家計簿アイテム型
export type KakeiboItem = {
  id: number;
  date: string;
  item: string;
  payment: string;
  money: number;
  memo?: string;
};

type Props = {
  onAdd: (item: KakeiboItem) => void;
};

export default function FormDialog({ onAdd }: Props) {
  // ダイアログの開閉
  const [open, setOpen] = useState(false);
  // 編集モードかどうか
  const [isEdit, setIsEdit] = useState(false);

  // 入力値の state
  const [money, setMoney] = useState("");
  const [item, setItem] = useState("");
  const [payment, setPayment] = useState("");
  const [date, setDate] = useState("");

  const handleInputOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const handleEditOpen = () => {
    setOpen(true);
    setIsEdit(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
  };

  // 登録処理
  const handleRegister = () => {
    const newItem: KakeiboItem = {
      id: Date.now(),
      date,
      item,
      payment,
      money: Number(money),
      memo: "",
    };

    onAdd(newItem); // 親(App)に渡して一覧更新

    // 入力欄リセット
    setMoney("");
    setItem("");
    setPayment("");
    setDate("");
    handleClose();
  };

  // 削除処理（編集モード用）
  const handleRemove = () => {
    localStorage.removeItem("expenses");
    handleClose();
  };

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleInputOpen}
          sx={{ width: "100px" }}
        >
          入力
        </Button>
        <Button
          variant="contained"
          onClick={handleEditOpen}
          sx={{ width: "100px" }}
        >
          編集
        </Button>
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <Box width="500px">
          <DialogTitle>{isEdit ? "編集" : "入力"}</DialogTitle>
          <DialogContent>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              margin="dense"
            />

            <SelectLabels
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />

            <SelectPayments
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="money"
              name="money"
              label="金額"
              type="number"
              fullWidth
              variant="standard"
              value={money}
              onChange={(e) => setMoney(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {isEdit && (
              <Button
                onClick={handleRemove}
                variant="contained"
                color="error"
              >
                削除
              </Button>
            )}
            <Button onClick={handleClose} variant="outlined">
              キャンセル
            </Button>
            <Button onClick={handleRegister} variant="contained">
              登録
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
