import { v4 as uuidv4, validate } from 'uuid';
import { User } from './types';

export class mockDB {
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
