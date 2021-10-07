import { useState, useEffect } from "react";

import { useParams, useHistory } from "react-router-dom";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
        <Button type="submit">save</Button>
      </form>
    </div>
  );
};
export default function Page() {
  const { postId, nick } = useParams();
  const [post, setPost] = useState();
  const [showEdit, setShowEdit] = useState(false);
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
  if (post === undefined) {
    return null;
  }

  const onSuccess = async () => {
    const res = await request.get(`/posts/${postId}`);
    setPost(res.data);
  };

  const onDelete = async () => {
    const res = await request.delete(`/posts/${postId}`);
    history.push(`/r/${nick}`);
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ mt: 10 }}>
          <CardContent>
            <h2>{post.title}</h2>
            {!showEdit && <p>{post.text}</p>}
            {showEdit && (
              <EditPost
                post={post}
                setShowEdit={setShowEdit}
                onSuccess={onSuccess}
              />
            )}
            {!showEdit && (
              <div>
                <Button onClick={onClick}>Edit</Button>
                <Button onClick={onDelete}>Delete Post</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
