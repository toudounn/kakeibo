export const headerItems = [
    {Headers:"No" , accessor:"id"},
    {Headers:"年月日" , accessor:"date"},
    {Headers:"項目" , accessor:"item"},
    {Headers:"支払方法" , accessor:"payment"},
    {Headers:"金額" , accessor:"money"},
    {Headers:"備考" , accessor:"memo"},
]

export type headerItems = {
    id: number;
    date: Date;
    item: string;
    payment: string;
    money: string;
    memo: string;
}

// export const grandTotalItem = [
//     {Headers:"項目",accessor:"item"},
//     {Headers:"１月",accessor:"jan"},
//     {Headers:"２月",accessor:"feb"},
//     {Headers:"３月",accessor:"mar"},
//     {Headers:"４月",accessor:"apr"},
//     {Headers:"５月",accessor:"may"},
//     {Headers:"６月",accessor:"jun"},
//     {Headers:"７月",accessor:"jul"},
//     {Headers:"８月",accessor:"aug"},
//     {Headers:"９月",accessor:"sep"},
//     {Headers:"１０月",accessor:"oct"},
//     {Headers:"１１月",accessor:"nov"},
//     {Headers:"１２月",accessor:"dec"},
//     {Headers:"合計",accessor:"total"},
//     {Headers:"平均",accessor:"average"},
// ]

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

export const iryouHeaders = [
    {
        Headers:"No",Accesser:"id"
    },
    {
        Headers:"名前",Accesser:"name"
    },
    {
        Headers:"病院等の名称",Accesser:"hospitalname"
    },
    // {
    //     Headers:"医療費の区分",Accesser:"classification"
    // },
    {
        Headers:"診療・治療",Accesser:"treatment"
    },
    {
        Headers:"医薬品購入",Accesser:"purchasingmedicines"
    },
    {
        Headers:"介護保険サービス",Accesser:"nursingcareinsurance"
    },
    {
        Headers:"その他医療費",Accesser:"othermedicalexpenses"
    },
    {
        Headers:"医療費",Accesser:"medicalexpenses"
    },
    {
        Headers:"補填された額",Accesser:"Compensation"
    },
    {
        Headers:"支払年月日",Accesser:"date"
    }
]

export type iryouItems = {
    id: number,
    name: string,
    hospitalname:string,
    treatment:string,
    purchasingmedicines:string,
    nursingcareinsurance:string,
    othermedicalexpenses:string,
    medicalexpenses:string,
    compensation:string,
    date: string,
}

export const iryouItems = [
    {
        id: 1,
        name: "東藤　奈緒子",
        hospitalname:"ともメンタルクリニック",
        treatment:"該当する",
        purchasingmedicines:"",
        nursingcareinsurance:"",
        othermedicalexpenses:"",
        medicalexpenses:"690",
        compensation:"",
        date: "2024/7/6",
    },
]