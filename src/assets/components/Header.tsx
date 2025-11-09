import { Box, Fab } from "@mui/material"
import { Link } from "react-router-dom"

export const Header = () => {


    return(
    <Box sx={{ '& > :not(style)': { m: 2 } }}>
    <Fab component={Link} to="/" variant="extended" size="small" color="primary">HOME</Fab>
    <Fab component={Link} to="grand-total" variant="extended" size="small" color="primary">総合計</Fab>
    <Fab component={Link} to="iryou" variant="extended" size="small" color="primary">医療費</Fab>
    <Fab component={Link} to="point" variant="extended" size="small" color="primary">ポイント払</Fab>
    <Fab component={Link} to="card" variant="extended" size="small" color="primary">カード明細</Fab>
    </Box>
    )
}