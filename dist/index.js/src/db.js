"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDB = void 0;
var uuid_1 = require("uuid");
var mockDB = /** @class */ (function () {
    function mockDB() {
        var _this = this;
        this.addUser = function (user) {
            if (user.uuid === undefined)
                user.uuid = (0, uuid_1.v4)();
            if (_this.isUser(user))
                _this.users.push(user);
            return user.uuid;
        };
        this.getUsers = function () {
            return _this.users;
        };
        this.getUser = function (uuid) {
            return ((0, uuid_1.validate)(uuid)) ? _this.users.find(function (user) { return user.uuid === uuid; }) : undefined;
        };
        this.updateUser = function (uuid, updateUser) {
            var user = _this.getUser(uuid);
            if (user) {
                user.username = updateUser.username ? updateUser.username : user.username;
                user.age = updateUser.age ? updateUser.age : user.age;
                user.hobbies = updateUser.hobbies ? updateUser.hobbies : user.hobbies;
            }
        };
        this.deleteUser = function (uuid) {
            var index = _this.users.findIndex(function (user) { return user.uuid === uuid; });
            if (index !== -1) {
                _this.users.splice(index, 1);
            }
        };
        this.users = [];
    }
    mockDB.prototype.isUser = function (user) {
        if ("uuid" in user && typeof user.uuid !== undefined)
            return ((0, uuid_1.validate)(user.uuid))
                && (typeof (user.username) === "string")
                && (typeof (user.age) === "number")
                && Array.isArray(user.hobbies);
        return (typeof (user.username) === "string")
            && (typeof (user.age) === "number")
            && Array.isArray(user.hobbies);
    };
    return mockDB;
}());
exports.mockDB = mockDB;
//# sourceMappingURL=db.js.map