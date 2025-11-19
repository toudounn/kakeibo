import { Box, Fab } from "@mui/material"
import { Link } from "react-router-dom"

export const Header = () => {


    return(
    <Box sx={{ '& > :not(style)': { m: 2 } }}>
    <Fab component={Link} to="/" variant="extended" size="small" color="primary">HOME</Fab>
    <Fab component={Link} to="grand-total" variant="extended" size="small" color="primary">総合計</Fab>
    </Box>
    )
}