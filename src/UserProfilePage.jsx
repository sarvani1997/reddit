import { useState, useEffect, useRef } from "react";

import { useParams, Link } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { request } from "./request";

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
            <Card
              key={post.id}
              variant="outlined"
              sx={{ mt: 3, borderRadius: "5px" }}
            >
              <CardContent>
                <Button component={Link} to={`/r/${nick}/posts/${post.id}`}>
                  {post.title}
                </Button>
                <div>{`Posted by u/${post.user.name}`}</div>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </div>
  );
}
