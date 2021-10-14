import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemButton from "@mui/material/ListItemButton";
import { DateTime } from "luxon";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import { request } from "./request";

const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function get() {
      const res = await request.get(`/posts`, { params: { userId } });
      setPosts(res.data);
    }
    get();
  }, []);

  return (
    <div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {posts.map((post) => {
          let duration = DateTime.fromISO(post.createdAt).toJSDate();
          duration = formatDistanceToNow(duration);
          return (
            <div key={post.id}>
              <ListItemButton
                alignItems="flex-start"
                component={Link}
                to={`/r/${post.subreddit.nick}/posts/${post.id}`}
              >
                <ListItemText primary={post.title} secondary={duration} />
              </ListItemButton>
              <Divider component="li" />
            </div>
          );
        })}
      </List>
    </div>
  );
};

export const Comment = () => {
  const { commentId } = useParams();

  const [comment, setComment] = useState();
  useEffect(() => {
    async function get() {
      const res = await request.get(`/comments/${commentId}`);
      setComment(res.data);
    }
    get();
  }, []);

  if (comment === undefined) {
    return null;
  }

  let duration = DateTime.fromISO(comment.createdAt).toJSDate();
  duration = formatDistanceToNow(duration);

  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <List>
            <ListItemButton
              alignItems="flex-start"
              component={Link}
              to={`/r/${comment.subreddit.nick}/posts/${comment.postId}`}
            >
              <ListItemText
                primary={`u/${comment.user.name} commented on ${comment.post.title}`}
                secondary={comment.post.text}
              />
            </ListItemButton>
            <ListItemButton>{comment.text}</ListItemButton>
            <>{duration}</>
          </List>
        </Card>
      </Container>
    </div>
  );
};

const Comments = ({ userId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function get() {
      const res = await request.get("/comments", { params: { userId } });
      setComments(res.data);
    }
    get();
  }, []);

  return (
    <div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {comments.map((comment) => {
          let duration = DateTime.fromISO(comment.createdAt).toJSDate();
          duration = formatDistanceToNow(duration);
          return (
            <div key={comment.id}>
              <ListItemButton
                alignItems="flex-start"
                component={Link}
                to={`/r/${comment.subreddit.nick}/posts/${comment.postId}`}
              >
                <ListItemText
                  primary={`u/${comment.user.name} commented on ${comment.post.title}`}
                  secondary={duration}
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to={`/r/${comment.subreddit.nick}/comments/${comment.id}`}
              >
                {comment.text}
              </ListItemButton>
              <Divider component="li" />
            </div>
          );
        })}
      </List>
    </div>
  );
};

export function UserProfile() {
  const { userId } = useParams();

  const [value, setValue] = useState(0);
  console.log(value);

  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Posts" />
            <BottomNavigationAction label="Comments" />
          </BottomNavigation>
        </Card>
        <Card variant="outlined" sx={{ mt: 5 }}>
          <CardContent>
            {value === 0 && <Posts userId={userId} />}
            {value === 1 && <Comments userId={userId} />}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
