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
exports.handleRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const db_1 = require("../db");
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
        return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    jsonwebtoken_1.default.verify(refreshToken, constants_1.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        const payload = decoded;
        const username = payload.username;
        const email = payload.email;
        const creator_username = payload.username;
        let creator_id = payload.creator_id;
        // Now you can use username and email to query the database
        (0, db_1.query)('SELECT * FROM creator WHERE email = $1', [email])
            .then(found_user => {
            if (!found_user) {
                return res.sendStatus(403); //Forbidden
            }
            // Generate a new access token
            const accessToken = jsonwebtoken_1.default.sign({ username: creator_username }, constants_1.ACCESS_SECRET_KEY, { expiresIn: '30m' });
            // Send the new access token
            res.json({
                accessToken,
                user: {
                    username,
                    creator_id
                },
            });
        })
            .catch(err => {
            // Handle error
            console.error(err);
            res.sendStatus(500); // Internal Server Error
        });
    });
});
exports.handleRefreshToken = handleRefreshToken;
