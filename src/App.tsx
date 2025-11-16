import { useState, useEffect } from "react";
import { KakeiboItem } from "./typs";
import FormDialog from "./assets/components/Daialog";
import AllTotal from "./pages/AllTotal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function App() {
  const [items, setItems] = useState<KakeiboItem[]>([]);
const [addSnackbarOpen, setAddSnackbarOpen] = useState(false);

const addItem = (newItem: KakeiboItem) => {
  const updated = [...items, { ...newItem, id: Date.now() }];
  setItems(updated);
  localStorage.setItem("expenses", JSON.stringify(updated));
  setAddSnackbarOpen(true); // ← 追加完了時にSnackbarを開く
};

const handleAddSnackbarClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === "clickaway") return;
  setAddSnackbarOpen(false);
};

  // 初期化: localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 更新処理
  const updateItem = (updatedItem: KakeiboItem) => {
  const updatedItems = items.map((item) =>
    item.id === updatedItem.id ? updatedItem : item
  );
  setItems(updatedItems);
  localStorage.setItem("expenses", JSON.stringify(updatedItems));
};

  // 削除処理
  const deleteItem = (id: number) => {
  const updatedItems = items.filter((item) => item.id !== id);
  setItems(updatedItems);
  localStorage.setItem("expenses", JSON.stringify(updatedItems));
};

  return (
    <>
      <FormDialog onAdd={addItem} />
      <AllTotal
        items={items}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
      {/* 追加Snackbar */}
    <Snackbar
      open={addSnackbarOpen}
      autoHideDuration={3000}
      onClose={handleAddSnackbarClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" onClose={() => setAddSnackbarOpen(false)} variant="filled">
        追加しました
      </Alert>
    </Snackbar>
    </>
  );
}

export default App;
