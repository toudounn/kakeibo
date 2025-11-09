import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function SelectLabels() {
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
          inputProps={{ 'aria-label': '項目' }}
        >
          <MenuItem value="">
            <em>選択</em>
          </MenuItem>
          <MenuItem value={1}>食費</MenuItem>
          <MenuItem value={2}>雑費</MenuItem>
          <MenuItem value={3}>嗜好品</MenuItem>
          <MenuItem value={4}>その他</MenuItem>
        </Select>
        <FormHelperText>項目を選択</FormHelperText>
      </FormControl>
    </div>
  );
}
