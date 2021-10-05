const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { prettify } = require("sql-log-prettifier");

const luxon = require("luxon");
const postgres = require("./postgres");
const user = require("./userRouter");

luxon.Settings.defaultZoneName = "Asia/Kolkata";

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.options("*", cors());

app.use("/users", user);

app.get("/", (req, res) => {
	res.json({});
});

app.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).json({ msg: "Internal Server Error", error: err });
});

const port = process.env.PORT || 7500;
app.listen(port, () => {
	console.log(`Listening at localhost:7500`);
});

(async () => {
	try {
		await postgres.authenticate();
		await postgres.sync({
			// force: true,
			logging: function (s) {
				let string = prettify(s);
				console.log(string);
			},
		});
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
})();
