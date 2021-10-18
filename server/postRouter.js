const _ = require("lodash");
const express = require("express");
const { StatusCodes } = require("http-status-codes");

const sequelize = require("./postgres");
const { getSubReddit } = require("./subRedditRouter");
const { authMiddleware } = require("./userRouter");

const postRouter = express.Router();
const { post: Post, subreddit: SubReddit, upvote: Upvote } = sequelize.models;

const postAllowedFields = ["title", "text", "subredditId"];

async function createPost(_data, userId) {
  let data = _.pick(_data, postAllowedFields);
  data = { ...data, userId };
  const post = await Post.create(data);
  return post.toJSON();
}

async function getPost(id) {
  const post = await Post.findOne({
    where: {
      id,
    },
    include: ["user", "subreddit"],
  });
  return post.toJSON();
}

async function handleUpvote(postId, userId) {
  return sequelize.transaction(async (t) => {
    console.log(postId, userId);
    const post = await getPost(postId);
    const existingUpvotes = await Upvote.findAll(
      {
        where: {
          userId,
          postId,
        },
      },
      {
        transaction: t,
      }
    );
    let { upvotes } = post;
    if (existingUpvotes.length === 0) {
      upvotes = (upvotes || 0) + 1;
      await Post.update(
        { upvotes },
        {
          where: {
            id: postId,
          },
        },
        {
          transaction: t,
        }
      );
      await Upvote.create(
        { postId, userId },
        {
          transaction: t,
        }
      );
    } else if (existingUpvotes.length > 0) {
      await Upvote.destroy(
        {
          where: {
            postId,
            userId,
          },
        },
        {
          transaction: t,
        }
      );
      await Post.update(
        { upvotes: upvotes - 1 },
        {
          where: {
            id: postId,
          },
        },
        {
          transaction: t,
        }
      );
    }
  });
}

async function getAllPosts(query) {
  const page = query.page || 1;
  const where = {};

  if (query.nick) {
    const subreddit = await getSubReddit(query.nick);
    where.subredditId = subreddit.id;
  }
  if (query.userId) {
    where.userId = query.userId;
  }

  let posts = await Post.findAll({
    where,
    include: ["user", "subreddit"],
    limit: 20,
    offset: (page - 1) * 20,
  });
  posts = posts.map((post) => post.toJSON());
  return posts;
}

async function updatePost(id, _data, userId) {
  const data = _.pick(_data, ["text"]);

  const post = await getPost(id);
  const subreddit = await SubReddit.findByPk(post.subredditId);
  if (post.userId === userId || subreddit.userId === userId) {
    await Post.update(data, {
      where: {
        id,
      },
    });
    return true;
  } else {
    return false;
  }
}

async function deletePost(id, userId) {
  const post = await getPost(id);
  const subreddit = await SubReddit.findByPk(post.subredditId);
  if (post.userId === userId || subreddit.userId === userId) {
    await Post.destroy({
      where: {
        id,
      },
    });
    return true;
  } else {
    return false;
  }
}

postRouter.post("/", authMiddleware, async (req, res, next) => {
  try {
    const post = await createPost(req.body, res.locals.userId);
    res.status(StatusCodes.CREATED).json(post);
  } catch (err) {
    next(err);
  }
});

postRouter.put("/:id/upvote", authMiddleware, async (req, res, next) => {
  try {
    const upvote = await handleUpvote(req.params.id, res.locals.userId);
    res.status(StatusCodes.NO_CONTENT).json(upvote);
  } catch (err) {
    next(err);
  }
});

postRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await getPost(req.params.id);
    if (!post) {
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts(req.query);
    res.status(StatusCodes.OK).json(posts);
  } catch (err) {
    next(err);
  }
});

postRouter.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const update = await updatePost(req.params.id, req.body, res.locals.userId);
    if (update) {
      res.status(StatusCodes.NO_CONTENT).end();
    } else {
      res.status(StatusCodes.FORBIDDEN).end();
    }
  } catch (err) {
    next(err);
  }
});

postRouter.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const deleted = await deletePost(req.params.id, res.locals.userId);
    if (deleted) {
      res.status(StatusCodes.NO_CONTENT).end();
    } else {
      res.status(StatusCodes.FORBIDDEN).end();
    }
  } catch (err) {
    next(err);
  }
});
module.exports = { postRouter, getPost };
