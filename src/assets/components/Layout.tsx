import { Outlet, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

export default function Layout() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/home">
            ホーム
          </Button>
          <Button color="inherit" component={Link} to="/category">
            年間
          </Button>
          <Button color="inherit" component={Link} to="/summary">
            その他
          </Button>
          <Button color="inherit" component={Link} to="/graph-page">
            グラフ
          </Button>
          <Button color="inherit" component={Link} to="/settings">
            設定
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
