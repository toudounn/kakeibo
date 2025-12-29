// 家計簿アイテム型
export type KakeiboItem = {
  id: number;          // 一意なID (Date.now()など)
  date: string;        // 日付 (YYYY-MM-DD)
  month: number;       // 月 (1〜12)
  category: "収入" | "固定費" | "生活費"; // カテゴリを限定
  name: string;        // 項目名 (例: 食費, 電気代)
  amount: number;      // 金額
  payment: string;       // 現金 / カード / ポイント
  paymentType?: string;  // カード・ポイントの種類
};
