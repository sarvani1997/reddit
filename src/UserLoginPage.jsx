import { useState, useEffect } from "react";
import { request } from "./request";
import { useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";

export default function LoginPage() {
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
			if (res.status === 200) {
				const user = res.data;

				history.push("/");
			} else {
				setError(true);
			}
		} catch (err) {
			console.log(err);
			setEmail("");
			setPassword("");
			setError(true);
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
								<p style={{ color: "red" }}>
									Incorrect email or Password
								</p>
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
