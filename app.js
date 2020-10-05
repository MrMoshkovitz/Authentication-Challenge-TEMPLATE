// npm packages
const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcrypt");
// const { coloredMorgan } = require("./helpers/coloredMorgan");

// globals
const password = "Rc123456!";
const saltRounds = 10;



// GAl To Delete
const { colorConfig, coloredMorgan, colorsMap } = require("./helpers/colorHelper");
colorsMap()





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
// let INFORMATION = [{user, info}]

// console.log(USERS)
// FORMATION [...{user, info},{}...],

// app.use(morgan("dev"));
app.use(coloredMorgan)
app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello World");
});
app.post("/users/register", async (req, res) => {
	let body = req.body;
	let req_email = body.email;
	let hashedPassword = await bcrypt.hash(req.body.password, 10)


	let exists = USERS.findIndex((user) => user.email == req_email);

	//Printing User Exists? 
	(exists !== -1) ? console.log("This User Exists", body.name, req_email, {"Exists": exists}) : console.log("User Not Exists", exists)
	
	if(exists === -1) {
		let newUserOBJ = {
			email: body.email,
			name: body.name,
			password: hashedPassword,
			isAdmin: body.isAdmin,
		}
		console.log(`Creating User Object ==> ${JSON.stringify(newUserOBJ)}`)

		let newInfoOBJ = {
			name: req.body.name,
			info: `${req.body.name} info`,
		};
		console.log(`User INFO ==> ${JSON.stringify(newInfoOBJ)}`)

		USERS.push(newUserOBJ)
		INFORMATION.push(newInfoOBJ);
		console.log(JSON.stringify({"New User": newUserOBJ}))
		// console.log(JSON.stringify({"newInfoOBJ": newInfoOBJ}));
		// console.log(JSON.stringify({"USERS": USERS}));
		res.status(201).send("Register Success");
	} else {
		res.status(409).send("user already exists");
	}
});
module.exports = app;
