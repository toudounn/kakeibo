import { useState, useEffect } from "react";
import FormDialog from "./assets/components/FormDialog";
import AllTotal from "./pages/AllTotal";
import { KakeiboItem } from "./typs";

export default function App() {
  const [items, setItems] = useState<KakeiboItem[]>([]);

  // 初期読み込み（localStorageから）
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 追加処理
  const addItem = (newItem: KakeiboItem) => {
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  // 更新処理
  const updateItem = (updatedItem: KakeiboItem) => {
    const updated = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  // 削除処理
  const deleteItem = (id: number) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>家計簿アプリ</h1>

      {/* 入力フォームダイアログ */}
      <FormDialog onAdd={addItem} onUpdate={updateItem} onDelete={deleteItem} />


      {/* 一覧表示 + 編集・削除 */}
      <AllTotal items={items} onUpdate={updateItem} onDelete={deleteItem} />
    </div>
  );
}