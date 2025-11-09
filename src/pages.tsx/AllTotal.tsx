import { Box, Radio, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { headerItems, items } from "../assets/util"
import FormDialog from "../assets/components/Daialog"

function AllTotal() {

  return (
    <>
      <FormDialog />
      <Box maxWidth={"1200px"} sx={{mx:"auto"}}>
        <Table>
          <TableHead>
          {headerItems.map((Headers) =>
            <TableCell>
              {Headers.Headers}
              </TableCell>
            )}
          </TableHead>
          <TableBody>
            {items.map((items) =>
            <TableRow>
            <Radio/>
            <TableCell>{items.id}</TableCell>
            <TableCell>{items.date}</TableCell>
            <TableCell>{items.item}</TableCell>
            <TableCell>{items.payment}</TableCell>
            <TableCell>{items.money}</TableCell>
            <TableCell>{items.memo}</TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </>
    )
  }
  
  export default AllTotal