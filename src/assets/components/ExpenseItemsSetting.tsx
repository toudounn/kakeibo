import {
  Box,
  Button,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";
import { useState, useEffect } from "react";
import { btnSx } from "./Settings";
  import { toRomaji } from "wanakana";

type ExpenseItem = {
  Headers: string;
  accessor: string;
};

export default function ExpenseItemsSetting() {
  const [tab, setTab] = useState(0);

  const [incomeItems, setIncomeItems] = useState<ExpenseItem[]>([]);
  const [expenditureItems, setExpenditureItems] = useState<ExpenseItem[]>([]);
  const [livingItems, setLivingItems] = useState<ExpenseItem[]>([]);

  const [newItem, setNewItem] = useState<ExpenseItem>({ Headers: "", accessor: "" });


const generateAccessor = (label: string) => {
  return toRomaji(label)
    .toLowerCase()
    .replace(/\s+/g, "_")      // 空白 → _
    .replace(/[^a-z0-9_]/g, ""); // 記号削除
};


  // 初期ロード時に localStorage から読み込み
  useEffect(() => {
    const savedIncome = localStorage.getItem("incomeItems");
    const savedExpenditure = localStorage.getItem("expenditureItems");
    const savedLiving = localStorage.getItem("livingItems");
    if (savedIncome) setIncomeItems(JSON.parse(savedIncome));
    if (savedExpenditure) setExpenditureItems(JSON.parse(savedExpenditure));
    if (savedLiving) setLivingItems(JSON.parse(savedLiving));
  }, []);

  const saveItems = (key: string, updated: ExpenseItem[]) => {
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!newItem.Headers) return;
    if (tab === 0) {
      const updated = [...incomeItems, newItem];
      setIncomeItems(updated);
      saveItems("incomeItems", updated);
    } else if (tab === 1) {
      const updated = [...expenditureItems, newItem];
      setExpenditureItems(updated);
      saveItems("expenditureItems", updated);
    } else {
      const updated = [...livingItems, newItem];
      setLivingItems(updated);
      saveItems("livingItems", updated);
    }
    setNewItem({ Headers: "", accessor: "" });
  };

  const handleDelete = (index: number) => {
    if (tab === 0) {
      const updated = incomeItems.filter((_, i) => i !== index);
      setIncomeItems(updated);
      saveItems("incomeItems", updated);
    } else if (tab === 1) {
      const updated = expenditureItems.filter((_, i) => i !== index);
      setExpenditureItems(updated);
      saveItems("expenditureItems", updated);
    } else {
      const updated = livingItems.filter((_, i) => i !== index);
      setLivingItems(updated);
      saveItems("livingItems", updated);
    }
  };

  const currentItems = tab === 0 ? incomeItems : tab === 1 ? expenditureItems : livingItems;

  return (
    <Box>
      {/* タブ切り替え */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="収入項目" />
        <Tab label="支出項目" />
        <Tab label="生活費項目" />
      </Tabs>

      {/* 入力フォーム */}
      <Stack direction="row" spacing={2} m={2}  justifyItems="center">
        <TextField
  label="表示名"
  value={newItem.Headers}
  onChange={(e) => {
    const value = e.target.value;
    setNewItem({
      Headers: value,
      accessor: generateAccessor(value), // ← 自動生成
    });
  }}
/>

        <Button variant="contained" onClick={handleAdd} sx={btnSx}>
          追加
        </Button>
      </Stack>

      {/* 一覧表示 */}
      <Table>
        <TableBody>
          {currentItems.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item.Headers}</TableCell>
              <TableCell>{item.accessor}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDelete(i)} sx={btnSx}>
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
