import request from "supertest";
import 'dotenv/config';
import { startSever } from "./server";
const PORT = process.env.PORT || "4000";

const server = startSever(PORT);

describe("Creating users", () => {
	let user_uuid: string;
	it("should answer with status code 200 and all users records (empty Array)", async () => {
		const response = await request(server).get('/api/users');
		expect(response.body).toEqual([]);
		expect(response.statusCode).toBe(200);
	});

	it('should crete a new user and return status code 201', async () => {
		const response = await request(server)
			.post('/api/users')
			.send({
				"username": "John",
				"age": 30,
				"hobbies": ["food", "videogames"]
			});

		const user = response.body;
		user_uuid = user.uuid;
		expect(response.statusCode).toBe(201);
		expect(response.body).toStrictEqual({
			"username": "John",
			"age": 30,
			"hobbies": ["food", "videogames"],
			"uuid": user_uuid
		});

	});

	it("should answer with status code 200 and all users records (now with name John username)", async () => {
		const response = await request(server).get('/api/users');
		expect(response.body).toEqual([
			{
				"username": "John",
				"age": 30,
				"hobbies": ["food", "videogames"],
				"uuid": user_uuid
			}
		]);
		expect(response.statusCode).toBe(200);
	});

	afterAll(() => {
		server.close()
	})
});

describe("Deleting users", () => {
	let user_uuid: string;

	it("should delete user with {userid} and answer with status code 204 if the record is found and deleted", async () => {
		const presponse = await request(server)
			.post('/api/users')
			.send({
				"username": "John",
				"age": 30,
				"hobbies": ["food", "videogames"]
			});
		user_uuid = presponse.body.uuid;

		console.log(presponse.body)
		const response = await request(server).
			delete(`/api/users/${user_uuid}`);
		expect(response.body).toEqual({});
		expect(response.statusCode).toBe(204);
	});

})

describe("Accessing wrong route", () => {

	it("should answer with status code 404", async () => {
		const response = await request(server).get('/api/non/existent/endpoint');
		expect(response.statusCode).toBe(404);
	})
})
