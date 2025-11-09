import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function SelectPayments() {
  const [item, setItem] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setItem(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={item}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': '支払方法' }}
        >
          <MenuItem value="">
            <em>選択</em>
          </MenuItem>
          <MenuItem value={1}>現金</MenuItem>
          <MenuItem value={2}>カード</MenuItem>
          <MenuItem value={3}>ポイント</MenuItem>
        </Select>
        <FormHelperText>項目を選択</FormHelperText>
      </FormControl>
    </div>
  );
}
