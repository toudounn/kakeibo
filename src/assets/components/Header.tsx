import { Box, Fab } from "@mui/material"
import { Link } from "react-router-dom"

export const Header = () => {


    return(
    <Box sx={{ '& > :not(style)': { my: 2 } }}>
    <Fab component={Link} to="/" variant="extended" size="small" color="primary">HOME</Fab>
    <Fab component={Link} to="category" variant="extended" size="small" color="primary">カテゴリー別</Fab>
    </Box>
    )
}