import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { useKeycloakContext } from "../context/KeycloakContext";
import { AuthStatus } from "../types";
import SearchBar from "./SearchBar";

interface AppNavbarProps {
  title?: string;
}

export function AppNavbar({ title = "Music Catalog" }: AppNavbarProps) {
  const { state, login, logout } = useKeycloakContext();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const isAuthenticated = state.status === AuthStatus.AUTHENTICATED;
  const username =
    state.status === AuthStatus.AUTHENTICATED
      ? state.profile.username ?? state.profile.email ?? "Logged in"
      : undefined;

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenProfile = () => {
    if (state.status === AuthStatus.AUTHENTICATED) {
      state.keycloak.accountManagement();
    }
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const avatarLetter =
    username && username.length > 0 ? username.charAt(0).toUpperCase() : "?";

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
            color: "inherit",
          }}
          component={Link}
          to="/"
        >
          {title}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button color="inherit" component={Link} to="/artists">
            Artists
          </Button>
          <Button color="inherit" component={Link} to="/tracks">
            Tracks
          </Button>

          <SearchBar />

          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                aria-label="user menu"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    bgcolor: "rgba(255,255,255,0.25)",
                    color: "white",
                  }}
                >
                  {avatarLetter}
                </Avatar>
              </IconButton>

              <Menu
                sx={{ mt: 1.5 }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                keepMounted
              >
                {username && (
                  <MenuItem disabled>
                    <Box component="span" sx={{ fontWeight: 500 }}>
                      {username}
                    </Box>
                  </MenuItem>
                )}
                <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              onClick={login}
              sx={{ fontWeight: 500 }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
