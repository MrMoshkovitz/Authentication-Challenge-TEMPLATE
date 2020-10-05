const jwt = require("jsonwebtoken");

const generateToken = (user, secret, expiresIn) => {
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

// // Validates login details and returns access and refresh tokens
// app.post('/users/login', async (req, res) => {
//     const user = USERS.find(user => user.email === req.body.email);
//     if (!user) return res.status(404).json({message: 'cannot find user'});
//     if (await bcrypt.compare(req.body.password, user.password)) {
//         const accessToken = generateAccessToken(user);
//         const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
//         REFRESH_TOKENS.push(refreshToken);
//       res.json({ accessToken, refreshToken , userName: user.name, isAdmin: user.isAdmin});
//       } else {
//           res.status(403).json({message: 'User or Password incorrect'});
//         };
//   });

//   // function for access keys generation, uses server's secret key and user details.
//   function generateAccessToken(user) {
//     return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
//   };

//   // Validates access token with the server
//   function checkToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.status(401).json({message: "Access Token Required"});
//     jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
//       if (err) return res.status(403).json({message: "Invalid Access Token"});
//       req.decoded = decoded;
//       next();
//     });

//     const newToken = (name, lifeTime) => {
//         const token = jwt.sign({
//             name: name
//         },
//             'secret',
//             {
//                 expiresIn: lifeTime
//             }
//         )

//         return token
//     };
