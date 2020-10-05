// npm packages
const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { colorHelper, generateToken } = require("./helpers/");

// const { coloredMorgan } = require("./helpers/coloredMorgan");

// globals
const ATOKEN_SECRET = "666666";
const RTOKEN_SECRET = "999999";

// GAl To Delete
const { colorConfig, coloredMorgan, colorsMap } = colorHelper;
// colorsMap()
const {
	impText,
	subject,
	stage,
	signs,
	links,
	text,
	error,
	success,
	method,
} = colorConfig;

let USERS = [
	{
		email: "admin@email.com",
		name: "admin",
		password: "$2b$10$YKyOHgZsMKva5d1bRawm8ex4IHVk5h8TJGWnlu./oG5NE/Q0e2H5K",
		isAdmin: "true",
	},
];
let INFORMATION = [
	{
		name: "admin",
		info: "admin info",
	},
];
let REFRESH_TOKENS = [];

app.use(coloredMorgan);
app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello World");
});
app.post("/users/register", async (req, res) => {
	let body = req.body;
	let hashedPassword = await bcrypt.hash(body.password, 10);

	let exists = USERS.findIndex((user) => user.email == body.email);

	if (exists === -1) {
		let newUserOBJ = {
			email: body.email,
			name: body.name,
			password: hashedPassword,
			isAdmin: body.isAdmin,
		};

		let newInfoOBJ = {
			name: req.body.name,
			info: `${req.body.name} info`,
		};

		USERS.push(newUserOBJ);
		INFORMATION.push(newInfoOBJ);

		console.log("");
		console.log(success("Register Success"));
		res.status(201).send({ message: "Register Success" });
	} else {
		console.log("");
		console.log(error("Register Failed"), text("user already exists"));
		res.status(409).send({ message: "user already exists" });
	}
});

app.post("/users/login", async (req, res) => {
	let { email, password } = req.body;
	let user = USERS.find((user) => user.email == email);

	//Printing User Exists?
	if (!user) {
		console.log(error(`Cannot Find User `), method(email, password));
		return res.status(404).send({ message: "cannot find user" });
	}

	console.log("user", user);
	let compared = await bcrypt.compare(password, user.password);
	console.log("");
	if (compared) {
		let accessToken = generateToken(user, ATOKEN_SECRET, "30s");
		let refreshToken = REFRESH_TOKENS.find((user) => user.email === email);

		refreshToken = refreshToken
			? generateToken(user, RTOKEN_SECRET, "30s")
			: generateToken(user, RTOKEN_SECRET, "30s");
		REFRESH_TOKENS.push(refreshToken);
		// let RTOKEN_SECRET = generateToken(user, ATOKEN_SECRET, '24')
		console.log(success(`Login Success`));
		console.log(``);
		res.status(200).json({
			accessToken: accessToken,
			refreshToken: refreshToken,
			userName: user.name,
			isAdmin: user.isAdmin,
		});
	} else {
		console.log(error("Login Failed"), text("User or Password incorrect"));
		res.status(403).json({
			message: "User or Password incorrect",
		});
	}
});

app.post("/users/logout", async (req, res) => {
	console.log(signs("====="), stage("Logout"), signs("====="));
	let token = req.body.token;
	if (token) {
		jwt.verify(token, RTOKEN_SECRET, (err, decoded) => {
			if (err) {
				console.log(error(err))
				console.log(stage("logout token"), success(token));
				res.status(400).json({
					message: "Invalid Refresh Token",
				});
				return
			}
			console.log(stage("Refresh Token"), impText(REFRESH_TOKENS));
			// REFRESH_TOKENS.splice(REFRESH_TOKENS.indexOf( => ), 1)
			res.status(200).send({ message: "User Logged Out Successfully" });
		});
	} else {
		res.status(400).json({
			message: "Refresh Token Required",
		});
	}
});

module.exports = app;
