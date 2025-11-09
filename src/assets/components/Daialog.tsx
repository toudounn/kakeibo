import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SelectLabels from './Select';
import SelectPayments from './Select_payment';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';

export default function FormDialog() {

  // ダイアログの開閉
  const [open, setOpen] = React.useState(false);
  // 編集ダイアログの印
  const [isEdit,setIsEdit] = useState(false)

  const handleInputOpen = () => {
    setOpen(true);
  };
  const handleEditOpen = () => {
    setOpen(true)
    setIsEdit(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
  };



// ローカルストレージ参考URL  https://qiita.com/Akihiro0711/items/c4658eb1f13bcb846f00
// ローカルストレージに値を保存する
localStorage.setItem("key", "value");

// ローカルストレージから値を取得する
const value = localStorage.getItem("key");

const remuve = () => {
// ローカルストレージから値を削除する
localStorage.removeItem("key");
}

// useStateとuseEffectを使用し、localStorageを扱うためのフックを定義
const useLocalStorage = (key:any, initialValue:any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // localStorageから値を取得。値が存在しない場合はinitialValueを返す
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // useEffectを使用し、stateの値が変更された時にlocalStorageに値を保存
  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(storedValue);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={handleInputOpen} sx={{width:"100px"}}>
        入力
      </Button>
      {}
      <Button variant="contained" onClick={handleEditOpen} sx={{width:"100px"}}>
        編集
      </Button></Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const amountOfMoney = formJson.amountOfMoney;
            console.log(amountOfMoney);
            handleClose();
          },
        }}
      ><Box width="500px">
        {isEdit ?<DialogTitle>編集</DialogTitle> :
        <DialogTitle>入力</DialogTitle>}
        {/* editの時は値表示 */}
        <DialogContent>
          <DialogContent>ID：{}</DialogContent>
          <Typography>日付：
          <TextField type="date"/></Typography>
          <Typography>項目：
            {isEdit ? value :<SelectLabels />}</Typography>
          <Typography>支払方法：
            <SelectPayments />
          </Typography>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="money"
            label="金額"
            type="yen"
            fullWidth
            variant="standard"
            value={()=>isEdit ? value : null}
          />
        </DialogContent>
        <DialogActions>
          {isEdit && <Button onClick={remuve} variant="contained" color="error">削除</Button>}
          <Button onClick={handleClose} variant="outlined">キャンセル</Button>
          <Button onClick={()=>useLocalStorage} variant="contained">登録</Button>
        </DialogActions>
        </Box>
      </Dialog>
      {/* <Dialog
        open={isEdit}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const amountOfMoney = formJson.amountOfMoney;
            console.log(amountOfMoney);
            handleClose();
          },
        }}
      >
        <DialogTitle>入力フォーム</DialogTitle>
        <DialogContent>
          <DialogContentText>日付</DialogContentText>
          <TextField type="date" id="date" name="date" sx={{m:"10px"}} value={value}/>
          <DialogContentText>
            項目<SelectLabels />
          </DialogContentText>
          <DialogContentText>
            支払方法<SelectPayments />
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="money"
            type="yen"
            fullWidth
            variant="standard"
            value={value}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={remuve} variant="contained" color="error">削除</Button>
          <Button onClick={handleClose} variant="outlined">キャンセル</Button>
          <Button onClick={()=>useLocalStorage} variant="contained">登録</Button>
        </DialogActions>
      </Dialog> */}
    </React.Fragment>
  );
}

