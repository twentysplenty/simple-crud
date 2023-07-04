"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var http = require("node:http");
var mockDB = /** @class */ (function () {
    function mockDB() {
        var _this = this;
        this.addUser = function (user) {
            _this.users.push(user);
        };
        this.getUsers = function () {
            return _this.users;
        };
        this.getUser = function (name) {
            return _this.users.find(function (user) { return user.name === name; });
        };
        this.updateUser = function (name, updateUser) {
            var user = _this.getUser(name);
            if (user) {
                user.age = updateUser.age;
                user.hobbies = updateUser.hobbies;
            }
        };
        this.deleteUser = function (name) {
            var index = _this.users.findIndex(function (user) { return user.name === name; });
            if (index !== -1) {
                _this.users.splice(index, 1);
            }
        };
        this.users = [];
    }
    mockDB.prototype.isUser = function (user) {
        return (user.name !== undefined)
            && (typeof (user.name) === "string")
            && (user.age !== undefined)
            && (typeof (user.age) === "number")
            && (user.hobbies !== undefined)
            && Array.isArray(user.hobbies);
    };
    return mockDB;
}());
var db = new mockDB();
var newUser = { name: "A", age: 25, hobbies: ["cooking"] };
if (db.isUser(newUser)) {
    db.addUser(newUser);
}
else {
    console.log("user format is invalid");
}
db.addUser({ name: "B", age: 25, hobbies: [] });
db.addUser({ name: "C", age: 25, hobbies: [] });
console.log(db.getUsers());
db.updateUser("A", { age: 100, hobbies: ["eating"] });
db.deleteUser("B");
console.log(db.getUsers());
console.log(db.getUser("C"));
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