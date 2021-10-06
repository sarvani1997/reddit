import { useState, useEffect } from "react";
import { request } from "./request";
import { useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const CreateSubreddit = ({ setCreateSubreddit, onSuccess }) => {
	const [name, setName] = useState("");
	const [nick, setNick] = useState("");

	const create = async () => {
		const res = await request.post(`/subreddit`, {
			name,
			nick,
		});
		const subreddit = await res.data;
		onSuccess();
	};

	const onSubmit = (e) => {
		e.preventDefault();
		create();
		setCreateSubreddit(false);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<TextField
					sx={{ mb: 2 }}
					required
					fullWidth
					id="name"
					label="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					sx={{ mb: 2 }}
					required
					fullWidth
					id="nickname"
					label="nick"
					value={nick}
					onChange={(e) => setNick(e.target.value)}
				/>
				<Button
					type="submit"
					sx={{ width: "100%" }}
					variant="contained"
				>
					Submit
				</Button>
			</form>
		</div>
	);
};

export default function Subreddit() {
	const [subreddits, setSubreddits] = useState([]);
	const [createSubreddit, setCreateSubreddit] = useState(false);

	useEffect(() => {
		async function get() {
			const res = await request.get(`/subreddit`);
			setSubreddits(res.data);
		}
		get();
	}, []);

	const onSuccess = () => {
		async function get() {
			const res = await request.get(`/subreddit`);
			setSubreddits(res.data);
		}
		get();
	};

	let onClick = () => {
		if (createSubreddit) {
			setCreateSubreddit(false);
		} else {
			setCreateSubreddit(true);
		}
	};

	return (
		<div>
			<Container maxWidth="sm">
				<Card variant="outlined" sx={{ mt: 10 }}>
					<CardContent>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<h4>Subreddits</h4>
							<Button variant="contained" onClick={onClick}>
								Create Subreddit
							</Button>
						</Stack>
						{createSubreddit && (
							<CreateSubreddit
								setCreateSubreddit={setCreateSubreddit}
								onSuccess={onSuccess}
							/>
						)}
						{subreddits.map((subreddit) => {
							return (
								<List disablePadding key={subreddit.id}>
									<ListItemButton>
										<ListItemText
											primary={subreddit.name}
											secondary={`nickname: ${subreddit.nick}`}
										/>
									</ListItemButton>
									<Divider />
								</List>
							);
						})}
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
