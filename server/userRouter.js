const _ = require("lodash");
const sequelize = require("./postgres");
const express = require("express");

const userRouter = express.Router();
const { User } = sequelize.models;

const userAllowedFields = ["name", "email", "password"];

async function createUser(data) {
	data = _.pick(data, userAllowedFields);
	let user = await User.create(data);
	return user.toJSON();
}

async function getUser(id) {
	let user = await User.findByPk(id);
	return user.toJSON();
}

async function updateUser(id, data) {
	await User.update(data, {
		where: {
			id,
		},
	});
}

async function deleteUser(id) {
	await User.destroy({
		where: {
			id,
		},
	});
}

userRouter.post("/", async (req, res, next) => {
	try {
		let user = await createUser(req.body);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

userRouter.get("/:id", async (req, res, next) => {
	try {
		let user = await getUser(req.params.id);
		if (!user) {
			res.status(404).end();
			return;
		}
		res.json(user);
	} catch (err) {
		next(err);
	}
});

userRouter.put("/:id", async (req, res, next) => {
	try {
		let user = await updateUser(req.params.id, req.body);
		res.end();
	} catch (err) {
		next(err);
	}
});

userRouter.delete("/:id", async (req, res, next) => {
	try {
		let user = await deleteUser(req.params.id);
		res.end();
	} catch (err) {
		next(err);
	}
});

module.exports = userRouter;
