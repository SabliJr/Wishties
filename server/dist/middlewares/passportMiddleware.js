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
const passport_1 = __importDefault(require("passport"));
const constants_1 = require("../constants");
const db_1 = require("../db");
const passport_jwt_1 = require("passport-jwt");
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as TwitterStrategy } from 'passport-twitter';
// import { Strategy as AppleStrategy } from 'passport-apple';
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: constants_1.ACCESS_SECRET_KEY
};
passport_1.default.use(new passport_jwt_1.Strategy(options, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_id = $1', [payload.creator_id]);
        if (rows.length === 0) {
            new Error('Invalid username or password.');
        }
        return done(null, rows[0]);
    }
    catch (error) {
        console.error(error);
        return done(error, false);
    }
})));
