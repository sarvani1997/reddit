import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { DateTime } from "luxon";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { request } from "./request";

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
