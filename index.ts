import 'dotenv/config';
import * as http from "node:http";
import { v4 as uuidv4, validate } from 'uuid';

type User = {
	uuid: string,
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
		if (this.isUser(user)) this.users.push(user);
	};
	getUsers = () => {
		return this.users;
	};
	getUser = (uuid: string) => {
		if (validate(uuid)) return this.users.find(user => user.uuid === uuid); //else
	}
	updateUser = (uuid: string, updateUser: { username: string, age: number, hobbies: string[] }) => {
		const user = this.getUser(uuid)
		if (user) {
			user.username = updateUser.username;
			user.age = updateUser.age;
			user.hobbies = updateUser.hobbies;
		}
	}
	deleteUser = (name: string) => {
		const index = this.users.findIndex(user => user.username === name);
		if (index !== -1) {
			this.users.splice(index, 1);
		}
	}
	isUser(user: User): user is User {
		return (typeof ((user as User).uuid) === "string")
			&& (typeof ((user as User).username) === "string")
			&& (typeof ((user as User).age) === "number")
			&& Array.isArray((user as User).hobbies)
	}
}

let db = new mockDB();
const newUser = {uuid: "3324d86f-2cfe-4518-bd3e-8ceb928eca5e", username: "A", age: 25, hobbies: ["cooking"] };
if (db.isUser(newUser)) {
	db.addUser(newUser);
} else {
	console.log("user format is invalid")
}

db.addUser({uuid: "46da50e9-7b9f-4759-a690-8748b2a52b8d", username: "B", age: 25, hobbies: [] })
db.addUser({uuid: "061b191f-a7bc-414d-be14-38f984167f75", username: "C", age: 25, hobbies: [] })
console.log(db.getUsers())
db.updateUser("46da50e9-7b9f-4759-a690-8748b2a52b8d", {username:"newName", age: 100, hobbies: ["eating"] });
db.deleteUser("061b191f-a7bc-414d-be14-38f984167f75");
console.log(db.getUsers())
console.log(db.getUser("46da50e9-7b9f-4759-a690-8748b2a52b8d"))

const server = http.createServer((req, res) => {
	const route = req.url.split("/").filter(element => element);
	if (req.url === "/api/users" && req.method === "GET") {
		res.writeHead(200, "Users access OK", { "Content-Type": "application/json" });
		res.end(JSON.stringify(db.getUsers()));
	}
})


server.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
})
