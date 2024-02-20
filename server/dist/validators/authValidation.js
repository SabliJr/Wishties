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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateCreator = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
const bcryptjs_1 = require("bcryptjs");
const verificationFunctions_1 = require("../util/verificationFunctions");
const password = (0, express_validator_1.check)('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.');
// Check if email is valid
const email = (0, express_validator_1.check)('email')
    .isEmail()
    .withMessage('Please provide a valid Email.');
//Check if email already exists in the database
const emailExist = (0, express_validator_1.check)('email').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield (0, db_1.query)('SELECT * FROM creator WHERE email = $1', [value]);
    if (rows.length > 0) {
        throw new Error('Email already exists');
    }
}));
// Check if email and password are valid
const loginCheck = (0, express_validator_1.check)('email').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield (0, db_1.query)('SELECT * FROM creator WHERE email = $1', [value]);
    if (rows.length === 0) {
        throw new Error('Invalid email or password.');
    }
    const { pwd } = rows[0];
    const isMatch = yield (0, bcryptjs_1.compare)(req.body.pwd, pwd);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }
    req.body.creator = rows[0];
}));
const authenticateCreator = (req, res, next) => {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
        return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    if (!refreshToken || !(0, verificationFunctions_1.isValidAuthToken)(refreshToken)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
exports.authenticateCreator = authenticateCreator;
const loginValidation = [loginCheck];
exports.loginValidation = loginValidation;
const registerValidation = [email, password, emailExist];
exports.registerValidation = registerValidation;
