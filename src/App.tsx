import { Box, Fab } from "@mui/material";
import { useState, useEffect } from "react";
import AllTotal, { KakeiboItem } from "./pages/AllTotal";
import FormDialog from "./assets/components/Daialog";

function App() {
  const [items, setItems] = useState<KakeiboItem[]>([]);

  // 初期化: localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 保存処理
  const addItem = (newItem: KakeiboItem) => {
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const allClear = () => {
    localStorage.removeItem("expenses");
    setItems([]);
  };

  return (
    <>
      <Box width="100%" textAlign="end">
        <Fab onClick={allClear} variant="extended" size="small" color="error">
          内容をすべて削除する
        </Fab>
      </Box>
      <FormDialog onAdd={addItem} />
      <AllTotal items={items} />
    </>
  );
}

export default App;
