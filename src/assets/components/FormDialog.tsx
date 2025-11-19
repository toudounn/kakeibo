import React, {  useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SelectLabels from "./SelectLabels";
import SelectPayments from "./Select_payment";
import { KakeiboItem } from "../../typs";


type Props = {
  onAdd: (item: KakeiboItem) => void;
  onUpdate: (item: KakeiboItem) => void;   // ← 追加
  onDelete: (id: number) => void;          // ← 削除用も追加すると便利
};


export default function FormDialog({ onAdd,onDelete }: Props) {
  // ダイアログの開閉
  const [open, setOpen] = useState(false);
  // 編集モードかどうか
  const [isEdit, setIsEdit] = useState(false);

  // 入力値の state
  const [money, setMoney] = useState("");
  const [item, setItem] = useState("");
  const [payment, setPayment] = useState("");
  const [date, setDate] = useState("");
  // 編集対象の id を保持する state
const [editingId, setEditingId] = useState<number | null>(null);
  // state に memo を追加
const [memo, setMemo] = useState("");
const [category, setCategory] = useState<"収入" | "支出">("支出");

// 入力ダイアログを開く
const handleInputOpen = () => {
  setOpen(true);
  setIsEdit(false);
};

// 閉じる
const handleClose = () => {
  setOpen(false);
  setIsEdit(false);
};

const handleRegister = () => {
  const newItem: KakeiboItem = {
    id: Date.now(),
    date,
    item,
    payment,
    money: Number(money),
    category, // ← 収入 or 支出
    memo: item === "その他" ? memo : "",
  };

  onAdd(newItem);
  // 入力欄リセット
  setMoney("");
  setItem("");
  setPayment("");
  setDate("");
  setCategory("支出");
  setMemo("");
  handleClose();
};

// 削除処理（編集モード用）
const handleRemove = () => {
  if (editingId !== null) {
    onDelete(editingId); // 親(App)に削除を依頼
    setEditingId(null);
  }
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
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <Box width="500px">
          <DialogTitle>{isEdit ? "編集" : "入力"}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">カテゴリ</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value as "収入" | "支出")}
            >
              <MenuItem value="収入">収入</MenuItem>
              <MenuItem value="支出">支出</MenuItem>
            </Select>
          </FormControl>

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

            {/* 「その他」を選んだときだけ備考欄を表示 */}
            {item === "その他" && (
              <TextField
                margin="dense"
                id="memo"
                name="memo"
                label="備考"
                type="text"
                fullWidth
                variant="standard"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            )}


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
              {isEdit ? "更新" : "登録"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
