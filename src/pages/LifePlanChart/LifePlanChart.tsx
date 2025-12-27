import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  SxProps,
  Typography,
} from "@mui/material";
import { useState } from "react";

type EventForm = {
  startingAge: number;
  endingAge: number;
  category: "収入" | "支出" | "";
  eventName: string;
  amount: number;
};

const inputFormSx: SxProps = {
  width: "150px",
};

export default function LifePlanChart() {
  const [events, setEvents] = useState<EventForm[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventForm | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // ★ 基準年齢を管理する state を追加
  const [baseAge, setBaseAge] = useState(30);
  const [form, setForm] = useState<EventForm>({
      startingAge: 30,
      endingAge: 35,
      category: "",
      eventName: "",
      amount: 0,
    });
  
  
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: name === "amount" || name.includes("Age") ? Number(value) : value,
      }));
    };
  
    const handleSelectChange = (e: SelectChangeEvent) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value as "収入" | "支出" }));
    };
  
    // フィールド定義をまとめる
    const fields = [
      { label: "開始年齢", accessor: "startingAge", type: "number" },
      { label: "終了年齢", accessor: "endingAge", type: "number" },
      { label: "区分", accessor: "category", type: "select" },
      { label: "名称", accessor: "eventName", type: "text" },
      { label: "金額", accessor: "amount", type: "number" },
    ];

  const startYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => startYear + i);

  const handleSubmit = () => {
    setEvents((prev) => [...prev,form]);
  };

  // ダイアログを開く
  const handleOpenDialog = (ev: EventForm, index: number) => {
    setSelectedEvent({ ...ev });
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  // 編集内容を更新
  const handleUpdateEvent = () => {
    if (selectedIndex !== null && selectedEvent) {
      const newEvents = [...events];
      newEvents[selectedIndex] = selectedEvent;
      setEvents(newEvents);
    }
    setDialogOpen(false);
  };

  // 削除
  const handleDeleteEvent = () => {
    if (selectedIndex !== null) {
      const newEvents = events.filter((_, i) => i !== selectedIndex);
      setEvents(newEvents);
    }
    setDialogOpen(false);
  };

  return (
    <Box>
      {/* ★ 基準年齢入力欄 */}
      <Stack direction="row" spacing={2} m={2}>
        <TextField
          sx={inputFormSx}
          label="基準年齢"
          type="number"
          value={baseAge}
          onChange={(e) => setBaseAge(Number(e.target.value))}
        />
      </Stack>
      <Stack direction="row" spacing={2} >
        <Box>
            {/* イベント入力フォーム */}
            <Stack direction="row" spacing={2} m={2} alignItems="center">
                {fields.map((field) => {
                if (field.type === "select") {
                    return (
                    <FormControl sx={{ width: "100px" }} key={field.accessor}>
                        <Select
                        name={field.accessor}
                        value={(form as any)[field.accessor]}
                        onChange={handleSelectChange}
                        >
                        <MenuItem value="収入">収入</MenuItem>
                        <MenuItem value="支出">支出</MenuItem>
                        </Select>
                    </FormControl>
                    );
                }
                return (
                    <TextField
                    sx={inputFormSx}
                    key={field.accessor}
                    label={field.label}
                    name={field.accessor}
                    type={field.type}
                    value={(form as any)[field.accessor]}
                    onChange={handleTextChange}
                    />
                );
                })}
                <Button variant="contained" onClick={handleSubmit} sx={{height:"50px"}}>登録</Button>
            </Stack>
        </Box>
    </Stack>
    <Table size="small" sx={{
      border: "1px solid black",
      "& td, & th": {
        border: "1px solid black",
        "& tr": {
          height: "20px", // Excel風に詰める
        },}}} >
    <TableHead>
        <TableRow>
        <TableCell sx={{width:"50px"}}><Typography fontSize="10px">イベント</Typography></TableCell>
        {years.map((y, i) => (
            <TableCell key={y}>
            {y}年<br />({baseAge + i}歳)
            </TableCell>
        ))}
        </TableRow>
    </TableHead>
    <TableBody>
        {events.map((ev, i) => (
        <TableRow key={i}>
            <TableCell
            sx={{ cursor: "pointer", color: "blue" }}
            onClick={() => handleOpenDialog(ev, i)}
            >
            {ev.eventName} ({ev.category})
            </TableCell>
            {years.map((y, j) => {
            const currentAge = baseAge + j;
            return (
                <TableCell key={y}>
                {currentAge >= ev.startingAge && currentAge <= ev.endingAge
                    ? ev.amount
                    : ""}
                </TableCell>
            );
            })}
        </TableRow>
        ))}

        {/* 収支差額行 */}
        <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}><Typography fontSize="10px">収支差額</Typography></TableCell>
        {years.map((y, j) => {
            const currentAge = baseAge + j;

            const incomeSum = events
            .filter(
                (ev) =>
                ev.category === "収入" &&
                currentAge >= ev.startingAge &&
                currentAge <= ev.endingAge
            )
            .reduce((sum, ev) => sum + ev.amount, 0);

            const expenseSum = events
            .filter(
                (ev) =>
                ev.category === "支出" &&
                currentAge >= ev.startingAge &&
                currentAge <= ev.endingAge
            )
            .reduce((sum, ev) => sum + ev.amount, 0);

            const balance = incomeSum - expenseSum;

            return (
            <TableCell
                key={y}
                sx={{ fontWeight: "bold", color: balance >= 0 ? "green" : "red" }}
            >
                {balance}
            </TableCell>
            );
        })}
        </TableRow>

        {/* 累積差額行 */}
        <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}><Typography fontSize="10px">累積差額</Typography></TableCell>
        {years.map((y, j) => {
            const currentAge = baseAge + j;

            // 各年度の収入合計
            const incomeSum = events
            .filter(
                (ev) =>
                ev.category === "収入" &&
                currentAge >= ev.startingAge &&
                currentAge <= ev.endingAge
            )
            .reduce((sum, ev) => sum + ev.amount, 0);

            // 各年度の支出合計
            const expenseSum = events
            .filter(
                (ev) =>
                ev.category === "支出" &&
                currentAge >= ev.startingAge &&
                currentAge <= ev.endingAge
            )
            .reduce((sum, ev) => sum + ev.amount, 0);

            // ★ 累積差額を計算（前年度までの累積 + 今年度差額）
            const thisYearBalance = incomeSum - expenseSum;
            const cumulativeBalance =
            j === 0
                ? thisYearBalance
                : years
                    .slice(0, j + 1)
                    .map((_, idx) => {
                    const age = baseAge + idx;
                    const inc = events
                        .filter(
                        (ev) =>
                            ev.category === "収入" &&
                            age >= ev.startingAge &&
                            age <= ev.endingAge
                        )
                        .reduce((sum, ev) => sum + ev.amount, 0);
                    const exp = events
                        .filter(
                        (ev) =>
                            ev.category === "支出" &&
                            age >= ev.startingAge &&
                            age <= ev.endingAge
                        )
                        .reduce((sum, ev) => sum + ev.amount, 0);
                    return inc - exp;
                    })
                    .reduce((sum, b) => sum + b, 0);

            return (
            <TableCell
                key={y}
                sx={{
                fontWeight: "bold",
                color: cumulativeBalance >= 0 ? "green" : "red",
                }}
            >
                {cumulativeBalance}
            </TableCell>
            );
        })}
        </TableRow>
    </TableBody>
    </Table>


      {/* 編集ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>イベント編集</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Stack spacing={2} mt={1}>
              <TextField
                label="開始年齢"
                type="number"
                value={selectedEvent.startingAge}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    startingAge: Number(e.target.value),
                  })
                }
              />
              <TextField
                label="終了年齢"
                type="number"
                value={selectedEvent.endingAge}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    endingAge: Number(e.target.value),
                  })
                }
              />
              <FormControl>
                <Select
                  value={selectedEvent.category}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      category: e.target.value as "収入" | "支出",
                    })
                  }
                >
                  <MenuItem value="収入">収入</MenuItem>
                  <MenuItem value="支出">支出</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="名称"
                value={selectedEvent.eventName}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    eventName: e.target.value,
                  })
                }
              />
              <TextField
                label="金額"
                type="number"
                value={selectedEvent.amount}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    amount: Number(e.target.value),
                  })
                }
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteEvent} color="error">
            削除
          </Button>
          <Button onClick={handleUpdateEvent} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
