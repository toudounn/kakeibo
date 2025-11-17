import GrandTotalTable from "./GrandTotalTable";

export default function GrandTotal() {
  const grandTotalItem = [
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
  ];

  const incomeExpenseItems = [
    {
      Headers: "給料",
      monthly: [250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000],
    },
    {
      Headers: "ボーナス",
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50000],
    },
  ];

  const expenditureExpenseItems = [
    {
      Headers: "食費",
      monthly: [40000, 35000, 38000, 42000, 39000, 41000, 43000, 40000, 37000, 39000, 41000, 42000],
    },
    {
      Headers: "交通費",
      monthly: [10000, 9000, 9500, 11000, 10500, 9800, 12000, 10000, 9500, 10200, 10800, 11500],
    },
  ];

  const livingExpensesItems = [
    {
      Headers: "家賃",
      monthly: [60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000],
    },
    {
      Headers: "光熱費",
      monthly: [15000, 14000, 16000, 15500, 15000, 14500, 16000, 15000, 14800, 15200, 14900, 15100],
    },
  ];

  return (
    <GrandTotalTable
      grandTotalItem={grandTotalItem}
      incomeExpenseItems={incomeExpenseItems}
      expenditureExpenseItems={expenditureExpenseItems}
      livingExpensesItems={livingExpensesItems}
    />
  );
}
