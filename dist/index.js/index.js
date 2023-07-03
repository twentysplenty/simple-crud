"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var server_1 = require("./src/server");
var PORT = process.env.PORT;
(0, server_1.startSever)(PORT);
//# sourceMappingURL=index.js.map