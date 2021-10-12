import { useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";

import { request } from "./request";
import { useSafeState } from "./hooks";

const CreatePost = ({ setCreatePost, onSuccess, subreddit }) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const create = async () => {
    const res = await request.post(`/posts`, {
      title,
      text,
      subredditId: subreddit.id,
    });
    await res.data;
    onSuccess();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    create();
    setCreatePost(false);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextField
          sx={{ mb: 2 }}
          required
          fullWidth
          id="setTitle"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          sx={{ mb: 2 }}
          required
          fullWidth
          multiline
          rows={10}
          id="post"
          label="Type Here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button type="submit" sx={{ width: "100%" }} variant="contained">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default function Subreddit() {
  const { nick } = useParams();
  const [createPost, setCreatePost] = useSafeState(false);
  const [subreddit, setSubreddit] = useSafeState();
  const [posts, setPosts] = useSafeState([]);

  useEffect(() => {
    async function get() {
      const res = await request.get(`/subreddit/${nick}`);
      setSubreddit(res.data);
    }
    get();
  }, []);

  useEffect(() => {
    async function get() {
      const res = await request.get(`/posts`, { params: { nick } });
      setPosts(res.data);
    }
    get();
  }, []);

  const onClick = () => {
    if (createPost) {
      setCreatePost(false);
    } else {
      setCreatePost(true);
    }
  };

  const onSuccess = () => {
    async function get() {
      const res = await request.get(`/posts`, { params: { nick } });
      setPosts(res.data);
    }
    get();
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
              <h2>Posts</h2>
              <Button variant="contained" onClick={onClick}>
                Create Post
              </Button>
            </Stack>
            {createPost && (
              <CreatePost
                setCreatePost={setCreatePost}
                onSuccess={onSuccess}
                subreddit={subreddit}
              />
            )}
          </CardContent>
        </Card>
        {posts.map((post) => {
          return (
            <Card
              key={post.id}
              variant="outlined"
              sx={{ mt: 3, borderRadius: "5px" }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center">
                  <Avatar
                    alt={post.user.name}
                    src={post.user.avatar}
                    sx={{ mr: 1.5, mb: 2 }}
                  />
                  <>{`Posted by u/${post.user.name}`}</>
                </Stack>
                <h3>{post.title}</h3>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/r/${nick}/posts/${post.id}`}
                  >
                    View More
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </div>
  );
}
