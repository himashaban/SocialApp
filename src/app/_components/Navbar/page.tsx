import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Button,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Instagram } from "@mui/icons-material";
import { useAppSelector, useAppDispatch, RootState } from "@/lib/store";
import { clearData } from "@/lib/authSlice";
import { UserInof } from "@/lib/postSlice";

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
const isAuthenticated = useAppSelector(
  (state: RootState) => !!state.auth.userToken
);
const userinfo = useAppSelector((state: RootState) => state.posts.userinfo);
const userLoading = useAppSelector((state) => state.posts.isLoading);
  const router = useRouter();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const logoutUser = () => {
    dispatch(clearData());
    
    handleMenuClose();
    router.push("/login");
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(UserInof());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(45deg, #C13584, #E1306C, #F56040)" }}
      >
        <Toolbar>
          {/* Logo - Always Visible */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Link href="/" passHref>
              <IconButton sx={{color:'white'}}>
                <Instagram />
              </IconButton>
            </Link>
          </Typography>

          {/* Username or Loading Indicator - Always Visible */}
          <Box
            sx={{ display: "flex", flexGrow: 1, ml: 1, alignItems: "center" }}
          >
            {isAuthenticated &&
              (userLoading ? (
                <Typography variant="body1">Loading...</Typography>
              ) : (
                <Typography variant="body1">
                  {userinfo?.name || "User"}
                </Typography>
              ))}
          </Box>

          {/* Desktop Menu Options */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} href="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} href="/register">
                  Register
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              color="inherit"
              aria-label="open mobile menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMenuClose}
      >
        {isAuthenticated ? (
          <>
            <MenuItem onClick={handleProfileMenuOpen}>
              <Link href="/profile" passHref>
                Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} href="/login">
              Login
            </MenuItem>
            <MenuItem component={Link} href="/register">
              Register
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} component={Link} href="/profile">
          Profile
        </MenuItem>
        <MenuItem onClick={logoutUser}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}
