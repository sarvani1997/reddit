import { useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { request } from "./request";

export default function Password() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const history = useHistory();

  const changePassword = async () => {
    try {
      const res = await request.put(`/users/changePassword`, {
        oldPassword,
        newPassword,
      });
      if (res.status === 204) {
        history.push(`/settings`);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    changePassword();
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <CardContent>
            <form onSubmit={onSubmit}>
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                id="user_old_password"
                label="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                id="user_new_password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                type="Password"
                id="user_password"
                label="confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>Incorrect Password</p>}
              <Button
                disabled={newPassword !== confirmPassword}
                type="submit"
                sx={{ width: "100%" }}
                variant="contained"
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
