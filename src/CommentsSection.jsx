import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { request } from './request';

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

const Comment = ({ comment, onSuccess, currentUser }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    if (
      comment.userId === currentUser.id ||
      comment.subreddit.userId === currentUser.id
    ) {
      setValidUser(true);
    }
  }, [comment]);

  const onEdit = () => {
    setShowEdit(true);
  };

  const onDelete = async (commentId) => {
    await request.delete(`/comments/${commentId}`);
    onSuccess();
  };

  const upvote = async (commentId) => {
    const res = await request.put(`/comments/${commentId}/upvote`);
    if (res.status === 204) {
      onSuccess();
    }
  };

  console.log(comment.subreddit.userId, currentUser.id);

  return (
    <div>
      {!showEdit ? (
        <Box sx={{ p: 1.5 }}>
          <Stack direction="row" alignItems="end" sx={{ mb: 1 }}>
            <Avatar
              alt={comment.user.name}
              src={comment.user.avatar}
              sx={{ width: 24, height: 24, mr: 1.5 }}
            />
            <>{`u/${comment.user.name}`}</>
          </Stack>
          <IconButton
            aria-label="upVote"
            // color={comment.userUpvoted ? 'primary' : 'default'}
            // onClick={() => upvote(comment.id)}
          >
            <ThumbUpIcon />
          </IconButton>
          <span>{comment.upvotes}</span>
          <div>{comment.text}</div>
        </Box>
      ) : (
        <EditComment
          comment={comment}
          setShowEdit={setShowEdit}
          onSuccess={onSuccess}
        />
      )}
      {!showEdit && validUser ? (
        <div>
          <Button size="small" onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" onClick={() => onDelete(comment.id)}>
            Delete
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const AddComment = ({ postId, onSuccess }) => {
  const [text, setText] = useState('');

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
    setText('');
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

export default function Comments({ postId, currentUser }) {
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
          <Comment
            key={comment.id}
            comment={comment}
            onSuccess={onSuccess}
            currentUser={currentUser}
          />
        );
      })}
    </div>
  );
}
