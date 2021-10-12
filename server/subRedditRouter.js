const _ = require("lodash");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const sequelize = require("./postgres");
const { authMiddleware } = require("./userRouter");

const subRedditRouter = express.Router();
const { subreddit: SubReddit, user: User } = sequelize.models;

const subRedditAllowedFields = ["name", "nick"];

async function createSubReddit(_data, userId) {
  let data = _.pick(_data, subRedditAllowedFields);
  data = { ...data, userId };
  const subReddit = await SubReddit.create(data);
  return subReddit.toJSON();
}

function isNumeric(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
}

async function getSubReddit(idOrNick) {
  const check = isNumeric(idOrNick);
  console.log(check, idOrNick);
  let where;
  if (check) {
    where = { id: idOrNick };
  } else {
    where = { nick: idOrNick };
  }
  const subReddit = await SubReddit.findOne({
    where,
  });
  return subReddit.toJSON();
}

async function getAllSubReddits() {
  let subReddits = await SubReddit.findAll({
    include: "user",
  });
  subReddits = subReddits.map((subReddit) => subReddit.toJSON());
  return subReddits;
}

async function updateSubReddit(id, _data) {
  const data = _.pick(_data, subRedditAllowedFields);
  await SubReddit.update(data, {
    where: {
      id,
    },
  });
}

async function deleteSubReddit(id, userId) {
  const subreddit = await getSubReddit(id);
  if (subreddit.userId === userId) {
    await SubReddit.destroy({
      where: {
        id,
      },
    });
    return true;
  }

  return false;
}

subRedditRouter.post("/", authMiddleware, async (req, res, next) => {
  try {
    const subReddit = await createSubReddit(req.body, res.locals.userId);
    res.status(StatusCodes.CREATED).json(subReddit);
  } catch (err) {
    next(err);
  }
});

subRedditRouter.get("/:id", async (req, res, next) => {
  try {
    const subReddit = await getSubReddit(req.params.id);
    if (!subReddit) {
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
    res.json(subReddit);
  } catch (err) {
    next(err);
  }
});

subRedditRouter.get("/", async (req, res, next) => {
  try {
    const subReddits = await getAllSubReddits();
    res.status(StatusCodes.OK).json(subReddits);
  } catch (err) {
    next(err);
  }
});

subRedditRouter.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    await updateSubReddit(req.params.id, req.body);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
});

subRedditRouter.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const deleted = await deleteSubReddit(req.params.id, res.locals.userId);
    if (deleted) {
      res.status(StatusCodes.NO_CONTENT).end();
    } else {
      res.status(StatusCodes.FORBIDDEN).end();
    }
  } catch (err) {
    next(err);
  }
});
module.exports = { subRedditRouter, getSubReddit };
