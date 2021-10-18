import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { DateTime } from "luxon";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import { request } from "./request";

const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function get() {
      const res = await request.get(`/posts`, { params: { userId } });
      setPosts((prevPosts) => prevPosts.concat(res.data));
    }
    get();
  }, []);

  const fetchData = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchData}
          hasMore={posts.length % 20 === 0}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
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
        </InfiniteScroll>
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function get() {
      const res = await request.get("/comments", { params: { userId, page } });
      setComments((prevComments) => prevComments.concat(res.data));
    }
    get();
  }, [page]);

  const fetchData = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchData}
          hasMore={comments.length % 20 === 0}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
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
        </InfiniteScroll>
      </List>
    </div>
  );
};

export default function UserProfile() {
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
