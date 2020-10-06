const jwt = require("jsonwebtoken");
const { colorHelper } = require("./colorHelper");
const { status } = colorHelper.colorConfig



const generateToken = (user, secret, expiresIn) => {
	console.log(status("Generating Token......"))
	const token = jwt.sign(
		{
			user: user,
		},
		secret,
		{ expiresIn: expiresIn }
	);

	return token;
};


module.exports = { generateToken };

