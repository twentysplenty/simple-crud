"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var http = require("node:http");
var uuid_1 = require("uuid");
var mockDB = /** @class */ (function () {
    function mockDB() {
        var _this = this;
        this.addUser = function (user) {
            if (_this.isUser(user))
                _this.users.push(user);
        };
        this.getUsers = function () {
            return _this.users;
        };
        this.getUser = function (uuid) {
            if ((0, uuid_1.validate)(uuid))
                return _this.users.find(function (user) { return user.uuid === uuid; }); //else
        };
        this.updateUser = function (uuid, updateUser) {
            var user = _this.getUser(uuid);
            if (user) {
                user.username = updateUser.username;
                user.age = updateUser.age;
                user.hobbies = updateUser.hobbies;
            }
        };
        this.deleteUser = function (name) {
            var index = _this.users.findIndex(function (user) { return user.username === name; });
            if (index !== -1) {
                _this.users.splice(index, 1);
            }
        };
        this.users = [];
    }
    mockDB.prototype.isUser = function (user) {
        return (typeof (user.uuid) === "string")
            && (typeof (user.username) === "string")
            && (typeof (user.age) === "number")
            && Array.isArray(user.hobbies);
    };
    return mockDB;
}());
var db = new mockDB();
var newUser = { uuid: "3324d86f-2cfe-4518-bd3e-8ceb928eca5e", username: "A", age: 25, hobbies: ["cooking"] };
if (db.isUser(newUser)) {
    db.addUser(newUser);
}
else {
    console.log("user format is invalid");
}
db.addUser({ uuid: "46da50e9-7b9f-4759-a690-8748b2a52b8d", username: "B", age: 25, hobbies: [] });
db.addUser({ uuid: "061b191f-a7bc-414d-be14-38f984167f75", username: "C", age: 25, hobbies: [] });
console.log(db.getUsers());
db.updateUser("46da50e9-7b9f-4759-a690-8748b2a52b8d", { username: "newName", age: 100, hobbies: ["eating"] });
db.deleteUser("061b191f-a7bc-414d-be14-38f984167f75");
console.log(db.getUsers());
console.log(db.getUser("46da50e9-7b9f-4759-a690-8748b2a52b8d"));
var server = http.createServer(function (req, res) {
    var route = req.url.split("/").filter(function (element) { return element; });
    if (req.url === "/api/users" && req.method === "GET") {
        res.writeHead(200, "Users access OK", { "Content-Type": "application/json" });
        res.end(JSON.stringify(db.getUsers()));
    }
});
server.listen(process.env.PORT, function () {
    console.log("Server running on port ".concat(process.env.PORT));
});
//# sourceMappingURL=index.js.map