"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.database = exports.secretKey = exports.user = exports.host = exports.password = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
exports.db = process.env.POSTGRES_DB || "";
exports.password = process.env.POSTGRES_PASSWORD || "";
exports.host = process.env.POSTGRES_HOST || "";
exports.user = process.env.POSTGRES_USER || "";
exports.secretKey = process.env.SECRET_TOKEN || "";
exports.database = new sequelize_1.Sequelize({
    username: exports.user,
    password: exports.password,
    database: exports.db,
    host: exports.host,
    dialect: "postgres",
});
exports.sequelize = new sequelize_1.Sequelize(exports.db, exports.user, exports.password, {
    host: exports.host,
    dialect: "postgres",
});
