import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

type Props = {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

export default function SelectPayments({ value, onChange }: Props) {
  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id="payment-select">支払方法</InputLabel>
      <Select
        labelId="payment-select"
        value={value}
        onChange={onChange}
      >
        <MenuItem value="現金">現金</MenuItem>
        <MenuItem value="クレジットカード">クレジットカード</MenuItem>
        <MenuItem value="電子マネー">電子マネー</MenuItem>
      </Select>
    </FormControl>
  );
}
