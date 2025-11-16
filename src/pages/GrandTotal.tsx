import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { expenditureExpenseItems, grandTotalItem, incomeExpenseItems, livingExpensesItems } from "../assets/util"

const GrandTotal = () => {
return(
    <>
    <Typography>総合計</Typography>
    <Table>
        <TableHead>
            {grandTotalItem.map((item)=>{
                return(
                <TableCell key={item.Headers}>{item.Headers}</TableCell>)
            })}
            
        </TableHead>
        <TableBody>
            {incomeExpenseItems.map((item)=>{
                return(
                    <TableRow key={item.Headers}>
                        <TableCell>{item.Headers}</TableCell>
                    </TableRow>
                )})
            }
            <TableRow>
                <TableCell>合計</TableCell>
            </TableRow>
            {expenditureExpenseItems.map((item)=>{
                return(
                    <TableRow key={item.Headers}>
                        <TableCell>{item.Headers}</TableCell>
                    </TableRow>
                )
            })}
            <TableRow>
                <TableCell>合計</TableCell>
            </TableRow>
            {livingExpensesItems.map((item)=>{
                return(
                    <TableRow key={item.Headers}>
                        <TableCell>{item.Headers}</TableCell>
                    </TableRow>
                )
            })}
            <TableRow>
                <TableCell>合計</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    </>
)
}
export default GrandTotal