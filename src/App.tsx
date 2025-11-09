import {Box, Fab} from "@mui/material"
import AllTotal from "./pages.tsx/AllTotal"

function App() {


  const allClear = () => {
    // ローカルストレージをすべてクリアする
    localStorage.clear();
    }
  
  return (
    <>
    <Box width="100%" textAlign="end">
    <Fab onClick={allClear} variant="extended" size="small" color="error">内容をすべて削除する</Fab>
    </Box>
    <AllTotal />
    </>
  )
}

export default App


