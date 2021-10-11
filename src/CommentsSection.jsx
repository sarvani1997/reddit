import { useState, useEffect } from "react";

import { useParams, useHistory } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { request } from "./request";

const EditComment = ({ comment, setShowEdit, onSuccess }) => {
  const [text, setText] = useState(comment.text);

  const onEdit = async () => {
    const res = await request.put(`/comments/${comment.id}`, {
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
          variant="standard"
          required
          fullWidth
          multiline
          // rows={4}
          id="post"
          // label="Edit comment here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={onClick}>Cancel</Button>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};

const Comment = ({ comment, onSuccess }) => {
  const [showEdit, setShowEdit] = useState(false);

  const onEdit = () => {
    setShowEdit(true);
  };

  const onDelete = async (commentId) => {
    await request.delete(`/comments/${commentId}`);
    onSuccess();
  };

  return !showEdit ? (
    <Box sx={{ p: 1.5 }}>
      <div>{comment.text}</div>
      <Button size="small" onClick={onEdit}>
        Edit
      </Button>
      <Button size="small" onClick={() => onDelete(comment.id)}>
        Delete
      </Button>
    </Box>
  ) : (
    <EditComment
      comment={comment}
      setShowEdit={setShowEdit}
      onSuccess={onSuccess}
    />
  );
};

const AddComment = ({ postId, onSuccess }) => {
  const [text, setText] = useState("");

  const onComment = async () => {
    const res = await request.post(`/comments`, {
      text,
      postId,
    });
    await res.data;
    onSuccess();
  };
  const onSubmit = (e) => {
    e.preventDefault();
    onComment();
    setText("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextField
          sx={{ mb: 2 }}
          variant="standard"
          required
          fullWidth
          multiline
          // rows={4}
          id="post"
          label="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit">Add Comment</Button>
      </form>
    </div>
  );
};

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function get() {
      const res = await request.get(`/comments/`, { params: { postId } });
      setComments(res.data);
    }
    get();
  }, []);

  const onSuccess = async () => {
    const res = await request.get(`/comments/`, { params: { postId } });
    setComments(res.data);
  };

  return (
    <div>
      <AddComment postId={postId} onSuccess={onSuccess} />
      {comments.map((comment) => {
        return (
          <Comment key={comment.id} comment={comment} onSuccess={onSuccess} />
        );
      })}
    </div>
  );
}
