// npm packages
const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { colorHelper, generateToken } = require("./helpers/");
// globals
const ATOKEN_SECRET = 'acb7951d49278777709951028c6cf1e4f11232c17548d809cd69d326000341a4f3067bcdf13c888f1eff3f204d3899ba2493dfca94855673b47e6ac5633eb6a5';
const RTOKEN_SECRET = '3c9c42cb1a09b382188f2ffa1a8b558913b8897334f691069ac5ed5170eabb2be29fb5716029599b630d9ebf9777cef5ae60dfe2198224c6046e2785d1d6f014';


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
		isAdmin: true,
	},
];
let INFORMATION = [];
let REFRESH_TOKENS = [];
let OPTIONS =
    [
        { method: "post", path: "/users/register", description: "Register, required: email, user, password", example: { email: "user@email.com", name: "user", password: "password" } },
        { method: "post", path: "/users/login", description: "Login, required: valid email and password", example: { email: "user@email.com", password: "password" } },
        { method: "post", path: "/users/token", description: "Renew access token, required: valid refresh token", example: { token: "Refresh Token" } },
        { method: "post", path: "/users/tokenValidate", description: "Access Token Validation, required: valid access token", example: { authorization: "Bearer Your Access Token" } },
        { method: "get", path: "/api/v1/information", description: "Access user's information, required: valid access token", example: { authorization: "Bearer Your Access Token" } },
        { method: "post", path: "/users/logout", description: "Logout, required: access token", example: { token: "Your Refresh Token" } },
        { method: "get", path: "/api/v1/users", description: "Get users DB, required: Valid access token of admin user", example: { authorization: "Bearer Your Access Token" } }
    ]
app.use(coloredMorgan);
app.use(express.json());
app.get("/", (req, res) => {
	console.log(signs("<<====="), stage("/ Endpoint"), signs("=====>>"));
	res.send("Hello World");
});
app.post("/users/register", async (req, res) => {
	console.log(signs("<<====="), stage("Register Endpoint"), signs("=====>>"));
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
		console.log(signs("<<====="), success("Register Success"), signs("=====>>"));
		res.status(201).send({ message: "Register Success" });
	} else {
		console.log("");
		console.log(error("Register Failed"), text("user already exists"));
		res.status(409).send({ message: "user already exists" });
	}
});
app.post("/users/login", async (req, res) => {
	console.log(signs("<<====="), stage("Login Endpoint"), signs("=====>>"));
	let { email, password } = req.body;
	let user = USERS.find((user) => user.email == email);

	//Printing User Exists?
	if (!user) {
		console.log((""))
		console.log(error(`Cannot Find User `), text(email, password));
		return res.status(404).send({ message: "cannot find user" });
	}

	let compared = await bcrypt.compare(password, user.password);
	if (compared) {
		let accessToken = generateToken(user, ATOKEN_SECRET, "30s");
		let refreshToken = REFRESH_TOKENS.find((refTok) => refTok.user.email === email);
		
		refreshToken = generateToken(user, RTOKEN_SECRET, "24h");
		REFRESH_TOKENS.push({user, refreshToken});
		console.log("");
		console.log(signs("<<====="), success(`Login Success`), signs("=====>>"));
		console.log("");
		console.log(subject(`Access Token`), success(accessToken));
		console.log("");
		console.log(subject(`Refresh Token`), success(JSON.stringify({user, refreshToken})));
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
	console.log(signs("<<====="), stage("Logout Endpoint"), signs("=====>>"));
	let token = req.body.token;
	if (token) {
		jwt.verify(token, RTOKEN_SECRET, (err, decoded) => {
			if (err) {
				console.log(subject("Invalid Refresh Token"), error(err), text(token))
				console.log("")
				res.status(400).json({
					message: "Invalid Refresh Token",
				});
				return
			}
			console.log(subject("logout token"), success(token));
			REFRESH_TOKENS.splice(REFRESH_TOKENS.indexOf(user => user.refreshToken === req.body.token ), 1)
			res.status(200).send({ message: "User Logged Out Successfully" });
		});
	} else {
		console.log(error("Refresh Token Required"))
		res.status(400).json({
			message: "Refresh Token Required",
		});
	}
});

function authenticateToken (req, res, next) {
	console.log(signs("<<====="), stage("authenticateToken"), signs("=====>>"));
	let authorizationHeader = req.headers.authorization
	let token = authorizationHeader && authorizationHeader.split(' ')[1]
	console.log(subject("Authenticate Token"), success(token))

	// return token
	if (token === null) return res.status(401).send("Access Token Required")
	console.log(error("Access Token Required"))

	return jwt.verify(token, ATOKEN_SECRET, (err, user) => {
		if(err) return res.status(403).send("Invalid Access Token")
		req.user = user
		next()
	})
}





app.post("/users/tokenValidate", authenticateToken, (req, res) => {
	console.log(signs("<<====="), stage("Token Validate"), signs("=====>>"));
	console.log(subjet("Token Validation"), success(JSON.stringify[{ valid: true }]))
	res.status(200).send({ valid: true });
})



app.get("/api/v1/information", authenticateToken, (req, res) => {
	console.log(signs("<<====="), stage("Information Endpoint"), signs("=====>>"));
	let user = req.user.user
	let name = user.name

	let info = INFORMATION.find((information) => information.name === name)
	console.log(subject("Get Inforamtion"), success(JSON.stringify({ user:user, info:info})))
	res.status(200).send([{ user:name, info:info}]);
})


app.post("/users/token", async (req, res) => {
	console.log(signs("||||||||||||||||||||||||||||||||||||||||||||||||||||||"))
	console.log(signs("<<====="), stage("User Token Endpoint"), signs("=====>>"));
	console.log(signs("||||||||||||||||||||||||||||||||||||||||||||||||||||||"))
	let token = req.body.token

	if(token === undefined)  {
		console.log(stage("/users/token"), error("Refresh Token Required"))
		return res.status(401).send("Refresh Token Required")
	}
	let exists = await REFRESH_TOKENS.find((tok) => tok.refreshToken === token)
	if(!exists) {
		console.log(stage("/users/token"), error("Invalid Access Token"))
		return res.status(403).send("Invalid Access Token")
	}
	jwt.verify(token, RTOKEN_SECRET, (err, decoded) => {
		if(err) {
			console.log(stage("/users/token"), error("Verification Of Refresh Code Denied"))
			return res.status(403).send({message: "Verification Of Refresh Code Denied"})
		}
		let user = decoded.user
		console.log(stage("/users/token"), success(JSON.stringify(decoded.user)))

		let accessToken = generateToken(user, ATOKEN_SECRET, '30s')
		console.log(subject("Get User Token "), success(JSON.stringify({ accessToken: accessToken })))
		res.status(200).send({ accessToken: accessToken });
	})

})



app.get("/api/v1/users", authenticateToken, (req, res) => {
	console.log(signs("<<====="), stage("Users List Endpoint"), signs("=====>>"));
	let user = req.user.user
	let isAdmin = user.isAdmin
	if(isAdmin) res.status(200).send(USERS)
	res.status(400).send({message: "User Is Not Privlege To Do This"})
})


app.options("/", (req, res) => {
	let authorizationHeader = req.headers.authorization
	console.log(subject("authorizationHeader"), impText(authorizationHeader))
	let token = authorizationHeader && authorizationHeader.split(" ")[1];
	console.log(subject("Token"), impText(token))
	if(token == null)  res.status(200).send([OPTIONS[0], OPTIONS[1]])
	jwt.verify(token, ATOKEN_SECRET, (err, decoded) => {
		if(err) {
			console.log("")
			console.log("")
			console.log(error("User Was Not Verified"))
			return res.status(200).send([OPTIONS[0], OPTIONS[1], OPTIONS[2]])
		}
		let { user } = decoded
		let isAdmin = user.isAdmin
		if(isAdmin) {
			console.log(subject("This Is an Admin User"), success(JSON.stringify(OPTIONS)))
			res.status(200).send(OPTIONS)
		}
		else {
			let newOptions = OPTIONS.filter((option, index) => {
				while( index <= 5) return option
			})
			console.log(subject("Authenticated User"), success(JSON.stringify(newOptions)), impText(JSON.stringify({Length: newOptions.length})))
			res.status(200).send(newOptions)

		}
	})
	
	// else return res.status(200).send([...OPTIONS])
	// else  res.status(200).send([OPTIONS[0], OPTIONS[1]])

	// res.status(200).send([...OPTIONS])
})

app.use((req, res) => {
    res.status(404).send('unknown endpoint')
})
module.exports = app;
