import { useState, useEffect } from "react";
import "./App.css";
import { request } from "./request";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addUser = async () => {
    const res = await request.post(`/users`, {
      name,
      email,
      password,
    });
    const user = await res.data;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addUser();
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <CardContent>
            <h3>Signup Form</h3>
            <form onSubmit={onSubmit}>
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                id="user_name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                id="user_email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                sx={{ mb: 2 }}
                required
                fullWidth
                id="user_name"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" sx={{ width: "100%" }} variant="contained">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
