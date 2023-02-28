"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const register_1 = require("./routes/register");
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3001;
exports.app.use(function (req, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Authorization, Access-Control-Request-Headers");
    next();
});
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// view engine setup
exports.app.set("views", path_1.default.join(__dirname, "views"));
exports.app.set("view engine", "jade");
// login routes
exports.app.use("/api/auth/register", register_1.registerRouter);
exports.app.listen(port, () => {
    console.log("listening at port ", port);
});
module.exports = exports.app;
