import  { useState } from "react";
import GrandTotalTable, { Item } from "./GrandTotalTable";
import MonthlyCategoryTotal from "./MonthlyCategoryTotal";

export default function GrandTotal() {
  const [items] = useState<Item[]>([]);


  return (
    <>

      {/* 集計表 */}
      <GrandTotalTable
        grandTotalItem={[
          { Headers: "項目" },
          { Headers: "1月" },
          { Headers: "2月" },
          { Headers: "3月" },
          { Headers: "4月" },
          { Headers: "5月" },
          { Headers: "6月" },
          { Headers: "7月" },
          { Headers: "8月" },
          { Headers: "9月" },
          { Headers: "10月" },
          { Headers: "11月" },
          { Headers: "12月" },
          { Headers: "合計" },
          { Headers: "平均" },
        ]}
        incomeExpenseItems={items.filter((i) => i.category === "収入")}
        expenditureExpenseItems={items.filter((i) => i.category === "支出")}
        livingExpensesItems={items.filter((i) => i.category === "生活費")}
      />

      <MonthlyCategoryTotal data={items} />
    </>
  );
}
