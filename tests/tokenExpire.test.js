const request = require("supertest");
const server = require("../app");
const { colorHelper } = require("../helpers/");
const { signs, error } = colorHelper.colorConfig

const userMock = {
	name: "test3",
	email: "test3@test.com",
	password: "Aa123456!",
};

describe("Token expiration and refresh test", () => {
	afterAll(async () => {
		server.close();
	});
	test("Access Token expires after 30s and can be renewed with refresh token", async (done) => {
		await request(server).post("/users/register").send(userMock).expect(201);
		console.log(signs("<<====="), error("/users/register"), signs("=====>>"));

		const { body: loginRes } = await request(server)
			.post("/users/login")
			.send(userMock)
			.expect(200);

		expect(loginRes.accessToken.length > 100).toBe(true);
		expect(typeof loginRes.accessToken).toBe("string");
		console.log(signs("<<====="), error("/users/login"), signs("=====>>"));

		const { body: infoRes } = await request(server)
			.get("/api/v1/information")
			.set("authorization", `bearer ${loginRes.accessToken}`)
            .expect(200);
            console.log(signs("<<====="), error("/api/v1/information"), signs("=====>>"));


		expect(infoRes.length > 0).toBe(true);
		await timeout(30500);

		await request(server)
			.get("/api/v1/information")
			.set("authorization", `bearer ${loginRes.accessToken}`)
			.expect(403);
			console.log(error(JSON.stringify(loginRes)))

		await request(server)
			.post("/users/token")
			.send({ blabla: "no token" })
			.expect(401);

		await request(server)
			.post("/users/token")
			.send({ token: "not valid token" })
			.expect(403);

		const { body: data } = await request(server)
			.post("/users/token")
			.send({ token: loginRes.refreshToken })
			.expect(200);

		expect(data.accessToken.length > 100).toBe(true);
		expect(typeof data.accessToken).toBe("string");

		const { body: infoRes2 } = await request(server)
			.get("/api/v1/information")
			.set("authorization", `bearer ${data.accessToken}`)
			.expect(200);

		expect(infoRes2.length > 0).toBe(true);
		done();
	}, 35000);
}, 35000);

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
