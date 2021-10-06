const _ = require("lodash");
const sequelize = require("./postgres");
const express = require("express");

const postRouter = express.Router();
const { Post } = sequelize.models;
const { authMiddleware } = require("./userRouter");
const { StatusCodes } = require("http-status-codes");

const postAllowedFields = ["text", "subredditId"];

async function createPost(data, userId) {
	data = _.pick(data, postAllowedFields);
	data = { ...data, userId };
	let post = await Post.create(data);
	return post.toJSON();
}

async function getPost(id) {
	let post = await Post.findByPk(id);
	return post.toJSON();
}

async function getAllPosts() {
	let posts = await Post.findAll();
	posts = posts.map((post) => post.toJSON());
	return posts;
}

async function updatePost(id, data) {
	data = _.pick(data, ["text"]);

	let post = await getPost(id);
	let subreddit = await SubReddit.findByPk(post.subredditId);
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
	let post = await getPost(id);
	let subreddit = await SubReddit.findByPk(post.subredditId);
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
		let post = await createPost(req.body, res.locals.userId);
		res.status(StatusCodes.CREATED).json(post);
	} catch (err) {
		next(err);
	}
});

postRouter.get("/:id", async (req, res, next) => {
	try {
		let post = await getPost(req.params.id);
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
		let posts = await getAllPosts();
		res.status(StatusCodes.OK).json(posts);
	} catch (err) {
		next(err);
	}
});

postRouter.put("/:id", authMiddleware, async (req, res, next) => {
	try {
		let update = await updatePost(req.params.id, req.body);
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
		let deleted = await deletePost(req.params.id, res.locals.userId);
		if (deleted) {
			res.status(StatusCodes.NO_CONTENT).end();
		} else {
			res.status(StatusCodes.FORBIDDEN).end();
		}
	} catch (err) {
		next(err);
	}
});
module.exports = postRouter;
