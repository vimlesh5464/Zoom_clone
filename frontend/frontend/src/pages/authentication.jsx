import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0); // 0 = login, 1 = register
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  const handleClose = () => setOpen(false);

  const resetFields = () => {
    setName("");
    setUsername("");
    setPassword("");
  };

  const handleAuth = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      // LOGIN
      if (formState === 0) {
        if (!username || !password) {
          setError("Username and password required");
          return;
        }

        await handleLogin(username, password);
      }

      // REGISTER
      if (formState === 1) {
        if (!name || !username || !password) {
          setError("All fields are required");
          return;
        }

        const result = await handleRegister(name, username, password);

        setMessage(result || "Registered successfully");
        setOpen(true);

        resetFields();
        setFormState(0);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Something went wrong";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        {/* LEFT SIDE IMAGE */}
        <Grid
          item
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* RIGHT SIDE FORM */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography variant="h5">
              {formState === 0 ? "Login" : "Register"}
            </Typography>

            {/* SWITCH BUTTONS */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>

              <Button
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setFormState(1)}
                sx={{ ml: 2 }}
              >
                Sign Up
              </Button>
            </Box>

            {/* FORM */}
            <Box sx={{ mt: 2, width: "100%" }}>
              {formState === 1 && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                fullWidth
                margin="normal"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* ERROR */}
              {error && (
                <Typography color="error" fontSize={14} sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              {/* BUTTON */}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : formState === 0 ? (
                  "Login"
                ) : (
                  "Register"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* SUCCESS SNACKBAR */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={message}
      />
    </ThemeProvider>
  );
}