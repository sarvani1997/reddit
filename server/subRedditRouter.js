const _ = require("lodash");
const sequelize = require("./postgres");
const express = require("express");

const subRedditRouter = express.Router();
const { SubReddit } = sequelize.models;

const subRedditAllowedFields = ["name", "nick"];

async function createSubReddit(data, userId) {
	data = _.pick(data, subRedditAllowedFields);
	data = { ...data, userId };
	let subReddit = await SubReddit.create(data);
	return subReddit.toJSON();
}

async function getSubReddit(id) {
	let subReddit = await SubReddit.findByPk(id);
	return subReddit.toJSON();
}

async function getAllSubReddits() {
	let subReddits = await SubReddit.findAll();
	subReddits = subReddits.map((subReddit) => subReddit.toJSON());
	return subReddits;
}

async function updateSubReddit(id, data) {
	await SubReddit.update(data, {
		where: {
			id,
		},
	});
}

async function DeleteSubReddit(id) {
	await SubReddit.destroy({
		where: {
			id,
		},
	});
}

subRedditRouter.post("/", async (req, res, next) => {
	try {
		let subReddit = await createSubReddit(req.body, res.locals.userId);
		res.json(subReddit);
	} catch (err) {
		next(err);
	}
});

subRedditRouter.get("/:id", async (req, res, next) => {
	try {
		let subReddit = await getSubReddit(req.params.id);
		if (!subReddit) {
			res.status(404).end();
			return;
		}
		res.json(subReddit);
	} catch (err) {
		next(err);
	}
});

subRedditRouter.get("/", async (req, res, next) => {
	try {
		let subReddits = await getAllSubReddits();
		res.json(subReddits);
	} catch (err) {
		next(err);
	}
});

subRedditRouter.put("/:id", async (req, res, next) => {
	try {
		let subReddit = await updateSubReddit(req.params.id, req.body);
		res.end();
	} catch (err) {
		next(err);
	}
});

subRedditRouter.delete("/:id", async (req, res, next) => {
	try {
		let subReddit = await deleteSubReddit(req.params.id);
		res.end();
	} catch (err) {
		next(err);
	}
});
module.exports = subRedditRouter;
