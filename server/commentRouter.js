const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const express = require('express');

const sequelize = require('./postgres');
const { authMiddleware, relaxedAuthMiddleware } = require('./userRouter');
const { getSubReddit } = require('./subRedditRouter');
const { getPost } = require('./postRouter');

const commentRouter = express.Router();
const { comment: Comment, upvote: Upvote } = sequelize.models;

const commentAllowedFields = ['text', 'postId'];

async function createComment(_data, userId) {
  let data = _.pick(_data, commentAllowedFields);
  console.log(data);
  const post = await getPost(data.postId);
  data = { ...data, userId, subredditId: post.subredditId };

  const comment = await Comment.create(data);
  return comment.toJSON();
}

async function getComment(id) {
  const comment = await Comment.findOne({
    where: {
      id,
    },
    include: ['user', 'subreddit', 'post'],
  });
  return comment.toJSON();
}

async function handleUpvote(commentId, userId) {
  return sequelize.transaction(async (t) => {
    console.log(userId);
    const comment = await getComment(commentId);
    const existingUpvotes = await Upvote.findAll(
      {
        where: {
          userId,
          commentId,
        },
      },
      {
        transaction: t,
      }
    );
    let { upvotes } = comment;
    if (existingUpvotes.length === 0) {
      upvotes = (upvotes || 0) + 1;
      await Comment.update(
        { upvotes },
        {
          where: {
            id: commentId,
          },
        },
        {
          transaction: t,
        }
      );
      await Upvote.create(
        { commentId, userId },
        {
          transaction: t,
        }
      );
    } else if (existingUpvotes.length > 0) {
      await Upvote.destroy(
        {
          where: {
            commentId,
            userId,
          },
        },
        {
          transaction: t,
        }
      );
      await Comment.update(
        { upvotes: upvotes - 1 },
        {
          where: {
            id: commentId,
          },
        },
        {
          transaction: t,
        }
      );
    }
  });
}

async function getAllComments(query, userId) {
  const page = query.page || 1;
  const where = {};

  if (query.postId) {
    where.postId = query.postId;
  }
  if (query.userId) {
    where.userId = query.userId;
  }

  let comments = await Comment.findAll({
    where,
    include: ['user', 'subreddit', 'post'],
    limit: 20,
    offset: (page - 1) * 20,
  });
  comments = comments.map((comment) => comment.toJSON());
  console.log(comments);

  // if (userId) {
  //   const upvotes = await Upvote.findAll({
  //     where: {
  //       commentId: comments.map((comment) => comment.id),
  //       userId,
  //     },
  //   });

  //   for (const comment of comments) {
  //     comment.userUpvoted = upvotes.some((u) => u.commentId === comment.id);
  //   }
  // }

  return comments;
}

async function updateComment(id, _data, userId) {
  const data = _.pick(_data, ['text']);

  const comment = await getComment(id);
  const subreddit = await getSubReddit(comment.subredditId);
  if (comment.userId === userId || subreddit.userId === userId) {
    await Comment.update(data, {
      where: {
        id,
      },
    });
    return true;
  }

  return false;
}

async function deleteComment(id, userId) {
  const comment = await getComment(id);
  const subreddit = await getSubReddit(comment.subredditId);

  if (comment.userId === userId || subreddit.userId === userId) {
    await Comment.destroy({
      where: {
        id,
      },
    });
    return true;
  }
  return false;
}

commentRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const comment = await createComment(req.body, res.locals.userId);
    res.status(StatusCodes.CREATED).json(comment);
  } catch (err) {
    next(err);
  }
});

commentRouter.get('/:id', async (req, res, next) => {
  try {
    const comment = await getComment(req.params.id);
    if (!comment) {
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

commentRouter.get('/', relaxedAuthMiddleware, async (req, res, next) => {
  try {
    const comments = await getAllComments(req.query, res.locals.userId);
    res.status(StatusCodes.OK).json(comments);
  } catch (err) {
    next(err);
  }
});

commentRouter.put('/:id/upvote', authMiddleware, async (req, res, next) => {
  try {
    const upvote = await handleUpvote(req.params.id, res.locals.userId);
    res.status(StatusCodes.NO_CONTENT).json(upvote);
  } catch (err) {
    next(err);
  }
});

commentRouter.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const update = await updateComment(
      req.params.id,
      req.body,
      res.locals.userId
    );
    if (update) {
      res.status(StatusCodes.NO_CONTENT).end();
    } else {
      res.status(StatusCodes.FORBIDDEN).end();
    }
  } catch (err) {
    next(err);
  }
});

commentRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const deleted = await deleteComment(req.params.id, res.locals.userId);
    if (deleted) {
      res.status(StatusCodes.NO_CONTENT).end();
    } else {
      res.status(StatusCodes.FORBIDDEN).end();
    }
  } catch (err) {
    next(err);
  }
});
module.exports = commentRouter;
