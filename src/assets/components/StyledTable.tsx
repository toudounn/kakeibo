import { styled, TableCell, TableRow } from "@mui/material";

// 縦線付きセル
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderRight: "1px solid #ccc",
  "&:last-child": {
    borderRight: 0,
  },
}));

// 交互色の行
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#f9f9f9",
  },
  "&:nth-of-type(odd)": {
    backgroundColor: "#ffffff",
  },
}));
