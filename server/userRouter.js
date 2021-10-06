const _ = require("lodash");
const sequelize = require("./postgres");
const express = require("express");
const randomstring = require("randomstring");
const { StatusCodes } = require("http-status-codes");

const userRouter = express.Router();
const { User, Login } = sequelize.models;

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
	data = _.pick(data, userAllowedFields);
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

async function loginUser(data) {
	let user = await User.unscoped().findOne({
		where: {
			email: data.email,
		},
	});
	user = user.toJSON();
	if (user.password === data.password) {
		let login = await Login.create({
			token: randomstring.generate(),
			userId: user.id,
		});
		login = login.toJSON();

		let newUser = await getUser(user.id);
		newUser = {
			...newUser,
			token: login.token,
		};
		return newUser;
	} else {
		throw new Error();
	}
}

async function validateToken(authorization, res) {
	if (authorization && authorization.includes("Bearer ")) {
		let token = authorization.slice(7);
		let logins = await Login.findAll({
			where: {
				token,
			},
		});
		if (logins.length === 0) {
			return false;
		} else {
			if (logins[0].userId) {
				res.locals.userId = logins[0].userId;
			}
			return true;
		}
	} else {
		return false;
	}
}

async function authMiddleware(req, res, next) {
	try {
		let valid = await validateToken(req.get("authorization"), res);
		if (valid) {
			next();
		} else {
			res.status(StatusCodes.UNAUTHORIZED).end();
		}
	} catch (err) {
		next(err);
	}
}

userRouter.post("/", async (req, res, next) => {
	try {
		let user = await createUser(req.body);
		res.status(StatusCodes.CREATED).json(user);
	} catch (err) {
		next(err);
	}
});

userRouter.get("/:id", async (req, res, next) => {
	try {
		let user = await getUser(req.params.id);
		if (!user) {
			res.status(StatusCodes.NOT_FOUND).end();
			return;
		}
		res.status(StatusCodes.OK).json(user);
	} catch (err) {
		next(err);
	}
});

userRouter.put("/:id", async (req, res, next) => {
	try {
		let user = await updateUser(req.params.id, req.body);
		res.status(StatusCodes.NO_CONTENT).end();
	} catch (err) {
		next(err);
	}
});

userRouter.delete("/:id", async (req, res, next) => {
	try {
		let user = await deleteUser(req.params.id);
		res.status(StatusCodes.NO_CONTENT).end();
	} catch (err) {
		next(err);
	}
});

userRouter.post("/log_in", async (req, res, next) => {
	try {
		console.log(req.body);
		let id = await loginUser(req.body);
		res.status(StatusCodes.CREATED).json(id);
	} catch (err) {
		next(err);
	}
});

module.exports = { userRouter, authMiddleware };
