import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";

import { request } from "./request";

const CreateSubreddit = ({ setCreateSubreddit, onSuccess }) => {
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");

  const create = async () => {
    const res = await request.post(`/subreddit`, {
      name,
      nick,
    });
    await res.data;
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
        <Button type="submit" sx={{ width: "100%" }} variant="contained">
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

  const onClick = () => {
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
                <List key={subreddit.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={`/r/${subreddit.nick}`}
                    >
                      <Avatar
                        alt={subreddit.user.name}
                        src={subreddit.user.avatar}
                        sx={{ mr: 1.5 }}
                      />
                      <ListItemText
                        primary={subreddit.name}
                        secondary={`created by u/${subreddit.user.name},  r/${subreddit.nick}`}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              );
            })}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
