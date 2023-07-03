import 'dotenv/config';
import * as http from "node:http";
import { v4 as uuidv4, validate } from 'uuid';

type User = {
	uuid?: string,
	username: string;
	age: number;
	hobbies: string[]
}

class mockDB {
	users: Array<User>
	constructor() {
		this.users = [];
	}
	addUser = (user: User) => {
		if (user.uuid === undefined) user.uuid = uuidv4();
		if (this.isUser(user)) this.users.push(user);
		return user.uuid;
	};
	getUsers = () => {
		return this.users;
	};
	getUser = (uuid: string): User | undefined => {
		return (validate(uuid)) ? this.users.find(user => user.uuid === uuid) : undefined;
	}
	updateUser = (uuid: string, updateUser: { username: string, age: number, hobbies: string[] }) => {
		const user = this.getUser(uuid)
		if (user) {
			user.username = updateUser.username ? updateUser.username : user.username;
			user.age = updateUser.age ? updateUser.age : user.age;
			user.hobbies = updateUser.hobbies ? updateUser.hobbies : user.hobbies;
		}
	}
	deleteUser = (uuid: string) => {
		const index = this.users.findIndex(user => user.uuid === uuid);
		if (index !== -1) {
			this.users.splice(index, 1);
		}
	}
	isUser(user: User): user is User {
		if ("uuid" in user && typeof user.uuid !== undefined)
			return (validate((user as User).uuid))
				&& (typeof ((user as User).username) === "string")
				&& (typeof ((user as User).age) === "number")
				&& Array.isArray((user as User).hobbies)
		return (typeof ((user as User).username) === "string")
			&& (typeof ((user as User).age) === "number")
			&& Array.isArray((user as User).hobbies)
	}
}

const db = new mockDB();

const server = http.createServer((req, res) => {
	const route = req.url.split("/").filter(element => element);

	if (req.url === "/api/users"
		&& req.method === "GET") {
		res.writeHead(200, "Users access OK", { "Content-Type": "application/json" });
		res.end(JSON.stringify(db.getUsers()));
	}
	else if (route.length === 3
		&& route[0] === "api"
		&& route[1] === "users"
		&& req.method === "GET") {
		const uuid = route[2];
		if (!validate(uuid)) {
			res.writeHead(400, "User id is invalid");
		}
		const user = db.getUser(uuid);
		if (user) {
			res.writeHead(200, "User access OK", { "Content-Type": "application/json" });
			res.end(JSON.stringify(user));
		} else {
			res.writeHead(404, "User with this id was not found")
			res.end();
		}
	}
	else if (req.url === "/api/users"
		&& req.method === "POST") {
		let requestBody: string = "";
		req.on("data", (chunk) => {
			requestBody += chunk;
		});

		req.on("end", () => {
			let reqBodyParsed: User = JSON.parse(requestBody);
			if (db.isUser(reqBodyParsed)) {
				const newUser = db.addUser(reqBodyParsed);
				res.writeHead(201, "User created");
				res.end(JSON.stringify(db.getUser(newUser)));
			} else {
				res.writeHead(400, "User body does not contain required fields")
				res.end();
			}
		});
	}
	else if (route.length === 3
		&& route[0] === "api"
		&& route[1] === "users"
		&& req.method === "PUT") {
		const uuid = route[2];
		if (!validate(uuid)) {
			res.writeHead(400, "User id is invalid");
			res.end();
		}
		const user = db.getUser(uuid);
		if (user) {
			let putRequestBody: string = "";
			req.on("data", (chunk) => {
				putRequestBody += chunk;
			});
			req.on("end", () => {
				let updatedUser: User;
				updatedUser = JSON.parse(putRequestBody);
				db.updateUser(uuid, updatedUser);
				res.writeHead(201, "User updated");
				res.end(JSON.stringify(user));
			});
		} else {
			res.writeHead(404, "User with this id does not exist")
			res.end();
		}
	}
	else if (route.length === 3
		&& route[0] === "api"
		&& route[1] === "users"
		&& req.method === "DELETE") {
		const uuid = route[2];
		if (!validate(uuid)) {
			res.writeHead(400, "User id is invalid");
			res.end();
		}
		const user = db.getUser(uuid);
		if (user) {
			db.deleteUser(uuid);
			res.writeHead(204, "Record was found and deleted");
			res.end();
		} else {
			res.writeHead(404, "User with this id does not exist");
			res.end();
		}
	}
	else {
		res.writeHead(404, "No endpoit found");
		res.end();
	}

})


server.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
})
