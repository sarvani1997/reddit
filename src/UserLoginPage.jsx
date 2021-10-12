import { useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import { request } from "./request";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();

  const loginUser = async () => {
    try {
      const res = await request.post(`/users/log_in`, {
        email,
        password,
      });
      if (res.status === 201) {
        const user = res.data;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        history.push("/dashboard");
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setEmail("");
      setPassword("");
      setError(true);
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    setLoading(true);

    e.preventDefault();
    loginUser();
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <CardContent>
            <h3>Log in</h3>
            <form onSubmit={onSubmit}>
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                id="user_email"
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                type="Password"
                id="user_password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p style={{ color: "red" }}>Incorrect email or Password</p>
              )}
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={loading}
                loadingIndicator="Logging In..."
                endIcon={<LoginIcon />}
              >
                Log In
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
