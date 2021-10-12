const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const express = require("express");

const sequelize = require("./postgres");
const { authMiddleware } = require("./userRouter");
const { getSubReddit } = require("./subRedditRouter");
const { getPost } = require("./postRouter");

const commentRouter = express.Router();
const { comment: Comment } = sequelize.models;

const commentAllowedFields = ["text", "postId"];

async function createComment(_data, userId) {
  let data = _.pick(_data, commentAllowedFields);
  console.log(data);
  const post = await getPost(data.postId);
  data = { ...data, userId, subredditId: post.subredditId };

  const comment = await Comment.create(data);
  return comment.toJSON();
}

async function getComment(id) {
  const comment = await Comment.findByPk(id);
  return comment.toJSON();
}

async function getAllComments(query) {
  let comments = await Comment.findAll({
    where: {
      postId: query.postId,
    },
  });
  comments = comments.map((comment) => comment.toJSON());
  return comments;
}

async function updateComment(id, _data, userId) {
  const data = _.pick(_data, ["text"]);

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

commentRouter.post("/", authMiddleware, async (req, res, next) => {
  try {
    const comment = await createComment(req.body, res.locals.userId);
    res.status(StatusCodes.CREATED).json(comment);
  } catch (err) {
    next(err);
  }
});

commentRouter.get("/:id", async (req, res, next) => {
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

commentRouter.get("/", async (req, res, next) => {
  try {
    const comments = await getAllComments(req.query);
    res.status(StatusCodes.OK).json(comments);
  } catch (err) {
    next(err);
  }
});

commentRouter.put("/:id", authMiddleware, async (req, res, next) => {
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

commentRouter.delete("/:id", authMiddleware, async (req, res, next) => {
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
