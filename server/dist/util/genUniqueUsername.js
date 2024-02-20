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
exports.generateUniqueUsername = void 0;
const db_1 = require("../db");
const generateUniqueUsername = (creator_name) => __awaiter(void 0, void 0, void 0, function* () {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let username = creator_name.replace(/\s+/g, ''); // Remove spaces from the user's name
    username += getRandomInt(1000, 9999); // Add random integers
    // Append additional characters (underscore, dash, dots)
    const additionalCharacters = ['_', '-', '.'];
    username += additionalCharacters[Math.floor(Math.random() * additionalCharacters.length)];
    // Check for uniqueness
    while (yield isUsernameTaken(username)) {
        username = username + getRandomInt(1000, 9999) + additionalCharacters[Math.floor(Math.random() * additionalCharacters.length)];
    }
    return username;
});
exports.generateUniqueUsername = generateUniqueUsername;
// THis function to check if the username is already taken in the database
const isUsernameTaken = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_name = $1', [username]);
        if (result.rows.length > 0) {
            // Username is taken
            return true;
        }
        // Username is not taken
        return false;
    }
    catch (error) {
        console.error('Error checking username availability:', error);
        // Handle the error appropriately, e.g., log it or throw a specific error
        throw new Error('Error checking username availability');
    }
});
