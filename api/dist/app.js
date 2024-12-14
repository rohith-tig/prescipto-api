"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const db_1 = require("./config/db");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/", router_1.default);
app.listen(8000, () => {
    console.log(`Server is running on http://localhost:8000`);
    db_1.database
        .authenticate()
        .then(() => {
        console.log("Database Connected");
    })
        .catch((error) => {
        console.log(`Wrong Db connection:${error}`);
    });
});
