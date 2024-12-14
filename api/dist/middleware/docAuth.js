"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDocToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.SECRET_TOKEN || "rohith@9866";
const verifyDocToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: "Authorization header is missing" });
        }
        const jwtToken = authHeader.split(" ")[1];
        if (!jwtToken) {
            return res
                .status(401)
                .json({ message: "JWT Token is missing or invalid" });
        }
        const payload = jsonwebtoken_1.default.verify(jwtToken, JWT_SECRET);
        req.docInfo = payload;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid or expired JWT Token" });
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "JWT Token has expired" });
        }
        else {
            console.error("Error verifying JWT Token:", error);
            return res.status(500).json({
                message: "An error occurred while verifying the JWT Token",
                error,
            });
        }
    }
});
exports.verifyDocToken = verifyDocToken;
