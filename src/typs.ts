// 家計簿アイテム型
export type KakeiboItem = {
  id: number;
  date: string;
  item: string;
  payment: string;
  money: number;
  category: "収入" | "支出"; 
  memo?: string;
};

export type AllTotalProps = {
  items: KakeiboItem[];
  onUpdate: (updatedItem: KakeiboItem) => void;
  onDelete: (id: number) => void;
};