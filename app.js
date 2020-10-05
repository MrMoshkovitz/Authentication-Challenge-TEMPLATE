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
// colorsMap()
const {impText, stage, signs, text } = colorConfig



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

app.use(coloredMorgan)
app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello World");
});
app.post("/users/register", async (req, res) => {
	let body = req.body;
	console.log(impText(JSON.stringify(body)))
	let hashedPassword = await bcrypt.hash(body.password, 10)


	let exists = USERS.findIndex((user) => user.email == body.email);

	//Printing User Exists? 
	(exists !== -1) ? console.log(text("This User Exists", body.name, body.email, {"Exists": exists})) : console.log(text("User Not Exists", exists))
	
	if(exists === -1) {
		let newUserOBJ = {
			email: body.email,
			name: body.name,
			password: hashedPassword,
			isAdmin: body.isAdmin,
		}
		console.log(stage(`Creating User Object `), signs("==>"), text(JSON.stringify(newUserOBJ)))

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
		res.status(201).send({"message": "Register Success"});
	} else {
		res.status(409).send({"message": "user already exists"});
	}
});
module.exports = app;
