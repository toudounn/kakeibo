// src/types.ts
export type KakeiboItem = {
  id: number;
  date: string;   // "YYYY-MM-DD"
  item: string;
  payment: string;
  money: number;
  memo?: string;
};

export type AllTotalProps = {
  items: KakeiboItem[];
  onUpdate: (updatedItem: KakeiboItem) => void;
  onDelete: (id: number) => void;
};