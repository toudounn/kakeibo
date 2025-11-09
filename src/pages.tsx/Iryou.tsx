import { Table, TableBody, TableCell, TableHead } from "@mui/material"
import { iryouHeaders, iryouItems } from "../assets/util"

function Iryou(){
   
return(
    <Table>
        <TableHead>
            {iryouHeaders.map((Headers)=>
                <TableCell>{Headers.Headers}</TableCell>
            )}
        </TableHead>
        <TableBody>
            {iryouItems.map((item)=>
              <>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.hospitalname}</TableCell>
            <TableCell>{item.treatment}</TableCell>
            <TableCell>{item.purchasingmedicines}</TableCell>
            <TableCell>{item.nursingcareinsurance}</TableCell>
            <TableCell>{item.othermedicalexpenses}</TableCell>
            <TableCell>{item.medicalexpenses}</TableCell>
            <TableCell>{item.compensation}</TableCell>
            <TableCell>{item.date}</TableCell>
            </>  )}
        </TableBody>
    </Table>
)
}
export default Iryou