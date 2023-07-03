"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSever = void 0;
var http = require("http");
var uuid_1 = require("uuid");
var db_1 = require("./db");
var startSever = function (port) {
    var server = http.createServer(function (req, res) {
        var db = new db_1.mockDB();
        var route = req.url.split("/").filter(function (element) { return element; });
        if (req.url === "/api/users"
            && req.method === "GET") {
            res.writeHead(200, "Users access OK", { "Content-Type": "application/json" });
            res.end(JSON.stringify(db.getUsers()));
        }
        else if (route.length === 3
            && route[0] === "api"
            && route[1] === "users"
            && req.method === "GET") {
            var uuid = route[2];
            if (!(0, uuid_1.validate)(uuid)) {
                res.writeHead(400, "User id is invalid");
            }
            var user = db.getUser(uuid);
            if (user) {
                res.writeHead(200, "User access OK", { "Content-Type": "application/json" });
                res.end(JSON.stringify(user));
            }
            else {
                res.writeHead(404, "User with this id was not found");
                res.end();
            }
        }
        else if (req.url === "/api/users"
            && req.method === "POST") {
            var requestBody_1 = "";
            req.on("data", function (chunk) {
                requestBody_1 += chunk;
            });
            req.on("end", function () {
                var reqBodyParsed = JSON.parse(requestBody_1);
                if (db.isUser(reqBodyParsed)) {
                    var newUser = db.addUser(reqBodyParsed);
                    res.writeHead(201, "User created");
                    res.end(JSON.stringify(db.getUser(newUser)));
                }
                else {
                    res.writeHead(400, "User body does not contain required fields");
                    res.end();
                }
            });
        }
        else if (route.length === 3
            && route[0] === "api"
            && route[1] === "users"
            && req.method === "PUT") {
            var uuid_2 = route[2];
            if (!(0, uuid_1.validate)(uuid_2)) {
                res.writeHead(400, "User id is invalid");
                res.end();
            }
            var user_1 = db.getUser(uuid_2);
            if (user_1) {
                var putRequestBody_1 = "";
                req.on("data", function (chunk) {
                    putRequestBody_1 += chunk;
                });
                req.on("end", function () {
                    var updatedUser;
                    updatedUser = JSON.parse(putRequestBody_1);
                    db.updateUser(uuid_2, updatedUser);
                    res.writeHead(201, "User updated");
                    res.end(JSON.stringify(user_1));
                });
            }
            else {
                res.writeHead(404, "User with this id does not exist");
                res.end();
            }
        }
        else if (route.length === 3
            && route[0] === "api"
            && route[1] === "users"
            && req.method === "DELETE") {
            var uuid = route[2];
            if (!(0, uuid_1.validate)(uuid)) {
                res.writeHead(400, "User id is invalid");
                res.end();
            }
            var user = db.getUser(uuid);
            if (user) {
                db.deleteUser(uuid);
                res.writeHead(204, "Record was found and deleted");
                res.end();
            }
            else {
                res.writeHead(404, "User with this id does not exist");
                res.end();
            }
        }
        else {
            res.writeHead(404, "No endpoit found");
            res.end();
        }
    });
    server.listen(port, function () {
        console.log("Server running on port ".concat(port));
    });
};
exports.startSever = startSever;
//# sourceMappingURL=server.js.map