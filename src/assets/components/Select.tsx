import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

type Props = {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

export default function SelectLabels({ value, onChange }: Props) {
  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id="label-select">項目</InputLabel>
      <Select
        labelId="label-select"
        value={value}
        onChange={onChange}
      >
        <MenuItem value="食費">食費</MenuItem>
        <MenuItem value="交通費">交通費</MenuItem>
        <MenuItem value="娯楽">娯楽</MenuItem>
      </Select>
    </FormControl>
  );
}
