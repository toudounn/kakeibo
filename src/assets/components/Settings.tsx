import {
  Box,
  Button,
  Stack,
  TextField,
  Tabs,
  Tab,
  Typography,
  SxProps,
} from "@mui/material";
  import { toRomaji } from "wanakana";
  import { useEffect, useState } from "react";
import {
  getCardTypes,
  getPointTypes,
  saveCardTypes,
  savePointTypes,
  deleteCardType,
  deletePointType,
} from "../../db/indexedDB";

type ExpenseItem = {
  Headers: string;
  accessor: string;
};

export const btnSx: SxProps = {mx:2,my:1,height:"40px"}

export default function Settings() {
  const [tab, setTab] = useState(0);

  const [incomeItems, setIncomeItems] = useState<ExpenseItem[]>([]);
  const [expenditureItems, setExpenditureItems] = useState<ExpenseItem[]>([]);
  const [livingItems, setLivingItems] = useState<ExpenseItem[]>([]);

  const [newItem, setNewItem] = useState<ExpenseItem>({ Headers: "", accessor: "" });

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
    <Box mt={2} className="widthSize" sx={{ margin: "0 auto" }}>
  {/* タブ切り替え */}
  <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" >
    <Tab label="収入" />
    <Tab label="固定費" />
    <Tab label="生活費" />
    <Tab label="クレジット" />
    <Tab label="ポイント" />
  </Tabs>
<Box justifyItems="center">
  {/* ▼ タブ 0〜2：項目登録 */}
  {tab <= 2 && (
    <>
      {/* ▼ 入力フォーム（カードと同じ縦並び UI） */}
    <Stack direction="row" mt={2} width="318px" alignItems="center">

      <TextField fullWidth value={newItem.Headers} onChange={(e) => {
          const value = e.target.value;
          setNewItem({
            Headers: value,
            accessor: generateAccessor(value),
          });
        }}
        placeholder="項目名を入力"
      />

      <Button variant="contained" sx={{ mt: 1, ...btnSx }} onClick={handleAdd} >
        追加
      </Button>
    </Stack>

      {/* ▼ 一覧表示（カードと同じ UI） */}
      <Box width="318px" mt={2}>
        {currentItems.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography>{item.Headers}</Typography>

            <Button
              variant="contained"
              color="error"
              sx={btnSx}
              onClick={() => handleDelete(i)}
            >
              削除
            </Button>
          </Box>
        ))}
      </Box>
    </>
  )}

  {/* ▼ タブ 3：クレジットカード */}
  {tab === 3 && (
    <Box mt={2}>

      <TextField
        value={newCard}
        onChange={(e) => setNewCard(e.target.value)}
        placeholder="カード名を入力"
      />
      <Button variant="contained" sx={btnSx} onClick={handleAddCard}>
        追加
      </Button>

      <Box width="318px" mt={2}>
        {cardTypes.map((c, index) => (
          <Box
            key={`${c}-${index}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
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
  )}

  {/* ▼ タブ 4：ポイントカード */}
  {tab === 4 && (
    <Box mt={2}>

      <TextField
        value={newPoint}
        onChange={(e) => setNewPoint(e.target.value)}
        placeholder="ポイント名を入力"
      />
      <Button variant="contained" sx={btnSx} onClick={handleAddPoint}>
        追加
      </Button>

      <Box mt={2}>
        {pointTypes.map((p, index) => (
          <Box
            key={`${p}-${index}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
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
    </Box>
  )}
  </Box>
</Box>

  );
}
