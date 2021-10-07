import { useState, useEffect, useRef } from "react";

import { useParams, Link } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { request } from "./request";

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
  const [createPost, setCreatePost] = useState(false);
  const [subreddit, setSubreddit] = useState();
  const [posts, setPosts] = useState([]);

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    async function get() {
      const res = await request.get(`/subreddit/${nick}`);
      if (mountedRef.current) {
        setSubreddit(res.data);
      }
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
              <h4>Posts</h4>
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
            <Card key={post.id} variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Button component={Link} to={`/r/${nick}/posts/${post.id}`}>
                  {post.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </div>
  );
}
