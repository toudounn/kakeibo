import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Props = {
  value: string;
  onChange: (e: any) => void;
};

export default function SelectLabels({ value, onChange }: Props) {
  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id="item-label">費目</InputLabel>
      <Select
        labelId="item-label"
        value={value}
        onChange={onChange}
      >
        <MenuItem value="食費">食費</MenuItem>
        <MenuItem value="交通費">交通費</MenuItem>
        <MenuItem value="家賃">家賃</MenuItem>
        <MenuItem value="光熱費">光熱費</MenuItem>
        <MenuItem value="その他">その他</MenuItem>
      </Select>
    </FormControl>
  );
}
