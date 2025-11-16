// src/assets/db.tsx

// データの型を定義します
export interface KakeiboItem {
  id: number;
  date: string;
  item: string;
  payment: string;
  money: string; // moneyは文字列型として定義します
  memo: string;
}

// 仮の初期データ（配列）をエクスポートします
export const items: KakeiboItem[] = [
  {
    id: 1,
    date: "2024/7/6",
    item: "食費",
    payment: "カード",
    money: "1,000",
    memo: ""
  },
  {
    id: 2,
    date: "2024/7/6",
    item: "雑費",
    payment: "現金",
    money: "1,000",
    memo: ""
  },
  {
    id: 3,
    date: "2024/7/6",
    item: "嗜好品",
    payment: "カード",
    money: "12,000",
    memo: ""
  },
];

// このファイル自体は、HTMLのscriptタグで直接読み込むのではなく、
// アプリケーションのメインファイル（例: App.tsx）でimportして使用してください。
