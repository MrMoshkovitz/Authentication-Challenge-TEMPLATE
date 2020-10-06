const request = require('supertest');
const server = require('../app');
const { colorHelper } = require("../helpers/");
const { success, stage, error } = colorHelper.colorConfig

// authorized user tests
const userInfoMock = {
    name: 'test',
    email: 'test@test.com',
    password: 'Aa123456!'
}

describe('Authorized User Tests', () => {
    afterAll(async () => {
        await server.close();
    })

    //authorized user can get info
    test('Authorized User Can Get Info', async (done) => {

        await request(server)
            .post('/users/register')
            .send(userInfoMock)
            .expect(201);

        const { body: loginRes } = await request(server)
            .post('/users/login')
            .send(userInfoMock)
            .expect(200);

        const { body: infoRes } = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${loginRes.accessToken}`)
            .expect(200)

        expect(infoRes.length > 0).toBe(true)
        console.log(stage("InfoRes"))
        console.log(error(JSON.stringify(infoRes)))
        console.log(stage("InfoRes.body"))
        console.log(error(JSON.stringify(infoRes.body)))
        console.log(stage("InfoRes[0]"))
        console.log(success(JSON.stringify(infoRes[0])))


        expect(infoRes[0].user).toBe(userInfoMock.name)

        await request(server)
            .get('/api/v1/information')
            .set('authorization', 'bearer notValidToken')
            .expect(403)

        done()
    })
})

