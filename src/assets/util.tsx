export const calendars =[
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
]

export type calenders = {
    Headers:string;
}

export const headerItems = [
    {Headers:"No" , accessor:"id"},
    {Headers:"年月日" , accessor:"date"},
    {Headers:"カテゴリ" , accessor:"category"},
    {Headers:"費目" , accessor:"item"},
    {Headers:"支払方法" , accessor:"payment"},
    {Headers:"金額" , accessor:"money"},
    {Headers:"備考" , accessor:"memo"},
]

export const incomeExpenseItems = [
    {Headers:"奈緒子",accessor:""},
    {Headers:"佑弥",accessor:""},
    {Headers:"將",accessor:""},
    {Headers:"嵩大",accessor:""},
    {Headers:"年金",accessor:""},
]

export const expenditureExpenseItems = [
    {Headers:"電気",accessor:"expenditure"},
    {Headers:"電話",accessor:"phone"},
    {Headers:"水道",accessor:"watersupply"},
    {Headers:"ガス",accessor:"gas"},
    {Headers:"灯油",accessor:"kerosene"},
    {Headers:"NHK",accessor:"nhk"},
    {Headers:"保険",accessor:"insurance"},
    {Headers:"米",accessor:"rice"},
    {Headers:"教育ローン",accessor:"educationloan"},
    {Headers:"車ローン",accessor:"carloan"},
    {Headers:"SS",accessor:"gasoline"},
    {Headers:"病院",accessor:"hospital"},
    {Headers:"交通費",accessor:"Transportation"},
    {Headers:"小遣い",accessor:"pocketmoney"},
]

export const livingExpensesItems = [
    {Headers:"食費",accessor:"food"},
    {Headers:"雑費",accessor:"miscellaneous"},
    {Headers:"嗜好品",accessor:"luxury"},
    {Headers:"特別支出",accessor:"special"},
]
export const headers = [
  { Headers: "年月日", accessor: "date" },
  {Headers:"カテゴリ" , accessor:"category"},
  { Headers: "費目", accessor: "category" },
  { Headers: "支出", accessor: "expenditure" },
  { Headers: "収入", accessor: "income" },
  { Headers: "合計", accessor: "total" },
];
