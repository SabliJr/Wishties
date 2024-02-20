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
exports.reverifyEmail = exports.emailVerification = exports.userLogout = exports.userLogin = exports.userRegistration = void 0;
const db_1 = require("../db");
const bcryptjs_1 = require("bcryptjs");
const constants_1 = require("../constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const genUniqueUsername_1 = require("../util/genUniqueUsername");
const verificationFunctions_1 = require("../util/verificationFunctions");
const NodemailerConfig_1 = __importDefault(require("../util/NodemailerConfig"));
// User Registration
const userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creator_name, email, password } = req.body;
    try {
        let creator_id = (0, uuid_1.v4)();
        const pwd = yield (0, bcryptjs_1.hash)(password, 12);
        const username = yield (0, genUniqueUsername_1.generateUniqueUsername)(creator_name);
        const verificationToken = (0, verificationFunctions_1.generateVerificationToken)(username, creator_id);
        yield (0, db_1.query)('INSERT INTO creator (creator_id, creator_name, email, pwd, username, verification_token) VALUES($1, $2, $3, $4, $5, $6)', [creator_id, creator_name, email, pwd, username, verificationToken]);
        const laMailOption = (0, verificationFunctions_1.sendVerificationEmail)(email, verificationToken);
        yield NodemailerConfig_1.default.sendMail(laMailOption);
        res.status(201).json({
            success: true,
            message: 'The registration was successful. Please check your email for verification.'
        });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again',
            error: error.message, // or any relevant information from the error
        });
    }
});
exports.userRegistration = userRegistration;
// Email Verification
const emailVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        // Check if the token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'The verification link is invalid.',
            });
        }
        // Verify the token with a custom clock timestamp
        const currentTime = Math.floor(Date.now() / 1000);
        const decoded = yield jsonwebtoken_1.default.verify(token, constants_1.REFRESH_TOKEN_SECRET, {
            clockTimestamp: currentTime,
        });
        const { creator_id: id, exp } = decoded;
        // Check if the token has expired
        if (exp && exp < currentTime) {
            return res.status(401).json({
                success: false,
                message: 'The verification link has expired. Please register again.',
            });
        }
        // update the verification status in the database
        yield (0, db_1.query)('UPDATE creator SET is_verified = TRUE WHERE creator_id = $1', [id]);
        const la_creator = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_id = $1', [id]);
        const { creator_id, creator_name } = la_creator.rows[0];
        // Create an access token that expires in 30  minutes
        const accessToken = yield jsonwebtoken_1.default.sign({ creator_id, creator_name }, constants_1.ACCESS_SECRET_KEY, { expiresIn: '10m' });
        // Redirect to the creator's wishlist page
        res.status(202).cookie('refreshToken', token, {
            maxAge: 1000 * 60 * 60 * 24 * 10, path: '/', sameSite: 'strict', httpOnly: true, secure: true
        }).json({
            success: true,
            message: 'The verification was successful!',
            user: {
                creator_id: la_creator.rows[0].creator_id,
                username: la_creator.rows[0].username,
            },
            accessToken: accessToken,
            role: 'creator',
            redirectURL: `${constants_1.CLIENT_URL}/edit-profile/${la_creator.rows[0].username}`
        });
    }
    catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again.',
            error: error.message, // or any relevant information from the error
        });
    }
});
exports.emailVerification = emailVerification;
// this is for requesting verification again
const reverifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Check if the email exists in the database
        const userResult = yield (0, db_1.query)('SELECT * FROM creator WHERE email = $1', [email]);
        if (!userResult.rows || userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User don't exist, please register.",
            });
        }
        const creator_id = userResult.rows[0].creator_id;
        const username = userResult.rows[0].username; // Extract username from the result
        const newVerificationToken = (0, verificationFunctions_1.generateVerificationToken)(username, creator_id); // Generate a new verification token
        // Update the existing token in the database (if you store it there)
        yield (0, db_1.query)('UPDATE creator SET verification_token = $1 WHERE email = $2', [
            newVerificationToken,
            email,
        ]);
        // Send a new verification email
        const laMailOption = (0, verificationFunctions_1.sendVerificationEmail)(email, newVerificationToken);
        yield NodemailerConfig_1.default.sendMail(laMailOption);
        res.status(200).json({
            success: true,
            message: 'A new verification email has been sent, please check your email.',
        });
    }
    catch (error) {
        console.error('Error during requesting verification again:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again.',
            error: error.message,
        });
    }
});
exports.reverifyEmail = reverifyEmail;
// Login creator
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creator } = req.body;
        const { creator_id, creator_name, email, username } = creator;
        // Check if the creator is verified, if not, send a new verification email.
        const is_verified = yield (0, db_1.query)('SELECT is_verified FROM creator WHERE email = $1', [email]);
        if (!is_verified.rows[0].is_verified) {
            const newVerificationToken = (0, verificationFunctions_1.generateVerificationToken)(username, creator_id);
            // Check if the token was generated successfully
            if (!newVerificationToken) {
                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong, please try again.',
                });
            }
            const emailSent = (0, verificationFunctions_1.sendVerificationEmail)(email, newVerificationToken);
            // Check if the email was sent successfully
            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong, please try again.',
                });
            }
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first, we have sent you a verification link.',
            });
        }
        // Create an access token that expires in 30  minutes
        const accessToken = yield jsonwebtoken_1.default.sign({ creator_id, creator_name, username }, constants_1.ACCESS_SECRET_KEY, { expiresIn: '30m' });
        // Create a refresh token that expires in 10 days
        const refreshToken = yield jsonwebtoken_1.default.sign({ creator_id, creator_name, username }, constants_1.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
        const la_creator = yield (0, db_1.query)('SELECT * FROM creator WHERE email = $1', [email]);
        res.status(202).cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 10, path: '/', sameSite: 'strict', httpOnly: true, secure: true
        }).json({
            success: true,
            message: 'The login was successful!',
            user: {
                creator_id: la_creator.rows[0].creator_id,
                username: la_creator.rows[0].username,
            },
            accessToken: accessToken,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong, please try again.');
    }
});
exports.userLogin = userLogin;
// Logout creator
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).clearCookie('refreshToken').json({
            success: true,
            message: 'logged out successfully!',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong, please try again.');
    }
});
exports.userLogout = userLogout;
