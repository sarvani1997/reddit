import { useState, useEffect } from "react";

import { useParams, useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Comments from "./CommentsSection";

import { request } from "./request";

const EditPost = ({ post, setShowEdit, onSuccess }) => {
  const [text, setText] = useState(post.text);

  const onEdit = async () => {
    const res = await request.put(`/posts/${post.id}`, {
      text,
    });
    await res.data;
    onSuccess();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onEdit();
    setShowEdit(false);
  };

  const onClick = () => {
    setShowEdit(false);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextField
          sx={{ mb: 2 }}
          required
          fullWidth
          multiline
          rows={4}
          id="post"
          label="Type Here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={onClick}>Cancel</Button>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};

export default function Page({ currentUser }) {
  const { postId, nick } = useParams();
  const [post, setPost] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function get() {
      const res = await request.get(`/posts/${postId}`);
      setPost(res.data);
    }
    get();
  }, []);

  const onClick = () => {
    setShowEdit(true);
  };

  useEffect(() => {
    if (post === undefined) {
      return null;
    }

    if (
      post.userId === currentUser.id ||
      post.subreddit.userId === currentUser.id
    ) {
      setValidUser(true);
    }
  }, [post]);

  if (post === undefined) {
    return null;
  }

  const onSuccess = async () => {
    const res = await request.get(`/posts/${postId}`);
    setPost(res.data);
  };

  const onDelete = async () => {
    await request.delete(`/posts/${postId}`);
    history.push(`/r/${nick}`);
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <CardContent>
            <h2>{post.title}</h2>
            <Stack direction="row" alignItems="end">
              <Avatar
                alt={post.user.name}
                src={post.user.avatar}
                sx={{ width: 24, height: 24, mr: 1.5 }}
              />
              <>{`Posted by u/${post.user.name}`}</>
            </Stack>

            {!showEdit ? (
              <p>{post.text}</p>
            ) : (
              <EditPost
                post={post}
                setShowEdit={setShowEdit}
                onSuccess={onSuccess}
              />
            )}
            {!showEdit && validUser ? (
              <div>
                <Button onClick={onClick}>Edit</Button>
                <Button onClick={onDelete}>Delete Post</Button>
              </div>
            ) : (
              <></>
            )}
            <Comments postId={postId} currentUser={currentUser} />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
