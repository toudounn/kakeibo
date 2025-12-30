import { Box, Typography } from "@mui/material";
import Input from "./pages/Input";

export default function App() {
 return(
  <Box className="widthSize">
    <Typography variant="h5" mt={3}>家計簿</Typography>
    <Input />
  </Box>
 )
}