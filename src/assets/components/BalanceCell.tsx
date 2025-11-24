import { TableCell } from "@mui/material";

type BalanceCellProps = {
  value: number;
};

const BalanceCell: React.FC<BalanceCellProps> = ({ value }) => {
  return (
    <TableCell sx={{ color: value < 0 ? "red" : "black" }}>
      {value}
    </TableCell>
  );
};

export default BalanceCell;

