// 家計簿アイテム型
export type KakeiboItem = {
  id: number;          // 一意なID (Date.now()など)
  date: string;        // 日付 (YYYY-MM-DD)
  month: number;       // 月 (1〜12)
  category: "収入" | "支出" | "生活費"; // カテゴリを限定
  name: string;        // 項目名 (例: 食費, 電気代)
  amount: number;      // 金額
  payment?: string;    // 支払い方法 (現金, カードなど)
};

export type AllTotalProps = {
  items: KakeiboItem[];
  onUpdate: (updatedItem: KakeiboItem) => void;
  onDelete: (id: number) => void;
};