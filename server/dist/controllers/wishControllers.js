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
exports.onUpdateWish = exports.onDeleteWish = exports.onAddWish = void 0;
const constants_1 = require("../constants");
const index_1 = require("../db/index");
const jsonwebtoken_1 = require("jsonwebtoken");
const s3_1 = require("../config/s3");
const constants_2 = require("../constants");
const onAddWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wish_name, wish_price, wish_category } = req.body;
    const wish_image = req.file;
    const isUploaded = yield (0, s3_1.onUploadImage)(wish_image, constants_2.WISHES_IMAGES_FOLDER);
    if (!isUploaded.status)
        return res.status(500).json({
            error: isUploaded.message
        });
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
        return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    // Verify the user's refresh token and get the user's username and email before sending the wish to the database;
    let decoded;
    try {
        decoded = (0, jsonwebtoken_1.verify)(refreshToken, constants_1.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(401);
    }
    const { creator_id } = decoded;
    try {
        const creator = yield (0, index_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        if (creator.rows.length === 0) {
            return res.status(404).json({
                error: 'unauthorized'
            });
        }
        yield (0, index_1.query)('INSERT INTO wishes (wish_name, wish_price, wish_image, wish_category, creator_id) VALUES ($1, $2, $3, $4, $5)', [wish_name, wish_price, isUploaded.imageUrl, wish_category, creator_id]);
        res.status(201).json({ message: 'Wish added successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the wish.' });
    }
});
exports.onAddWish = onAddWish;
const onDeleteWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wish_id } = req.query;
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
        return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    // Verify the user's refresh token and get the user's username and email before sending the wish to the database;
    let decoded;
    try {
        decoded = (0, jsonwebtoken_1.verify)(refreshToken, constants_1.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(401);
    }
    const { creator_id } = decoded;
    try {
        const creator = yield (0, index_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        if (creator.rows.length === 0) {
            return res.status(404).json({
                error: 'unauthorized'
            });
        }
        const wish = yield (0, index_1.query)('SELECT * FROM wishes WHERE wish_id = $1', [wish_id]);
        if (wish.rows.length === 0) {
            return res.status(404).json({
                error: 'Wish not found.'
            });
        }
        let wish_image = wish.rows[0].wish_image;
        wish_image = wish_image.split('/')[4];
        let isDeleted = yield (0, s3_1.onDeleteImage)(`${constants_2.WISHES_IMAGES_FOLDER}/${wish_image}`);
        if (!isDeleted.status)
            return res.status(500).json({
                error: isDeleted.message
            });
        yield (0, index_1.query)('DELETE FROM wishes WHERE wish_id = $1', [wish_id]);
        res.status(200).json({ message: 'Wish deleted successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the wish.' });
    }
});
exports.onDeleteWish = onDeleteWish;
const onUpdateWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { wish_id, wish_name, wish_price, wish_category } = req.body;
    let wish_image;
    let wish_image_file = req.file;
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
        return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    let decoded;
    try {
        decoded = (0, jsonwebtoken_1.verify)(refreshToken, constants_1.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(401);
    }
    const { creator_id } = decoded;
    try {
        const creator = yield (0, index_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        if (creator.rows.length === 0) {
            return res.status(404).json({
                error: 'unauthorized'
            });
        }
        const wish = yield (0, index_1.query)('SELECT * FROM wishes WHERE wish_id = $1', [wish_id]);
        if (wish.rows.length === 0) {
            return res.status(404).json({
                error: 'Wish not found.'
            });
        }
        if (wish_image_file) {
            let isDeleted = yield (0, s3_1.onDeleteImage)(`${constants_2.WISHES_IMAGES_FOLDER}/${wish_image_file}`);
            if (!isDeleted.status)
                return res.status(500).json({
                    error: isDeleted.message
                });
            const isUploaded = yield (0, s3_1.onUploadImage)(wish_image_file, constants_2.WISHES_IMAGES_FOLDER);
            if (!isUploaded.status)
                return res.status(500).json({
                    error: isUploaded.message
                });
            wish_image = isUploaded.imageUrl;
        }
        let queryText = 'UPDATE wishes SET ';
        let queryValues = [];
        let queryIndex = 1;
        if (wish_name) {
            queryText += `wish_name = $${queryIndex}, `;
            queryValues.push(wish_name);
            queryIndex++;
        }
        if (wish_price) {
            queryText += `wish_price = $${queryIndex}, `;
            queryValues.push(wish_price);
            queryIndex++;
        }
        if (wish_image) {
            queryText += `wish_image = $${queryIndex}, `;
            queryValues.push(wish_image);
            queryIndex++;
        }
        if (wish_category) {
            queryText += `wish_category = $${queryIndex}, `;
            queryValues.push(wish_category);
            queryIndex++;
        }
        queryText = queryText.slice(0, -2);
        queryText += ` WHERE wish_id = $${queryIndex}`;
        queryValues.push(wish_id);
        yield (0, index_1.query)(queryText, queryValues);
        res.status(200).json({ message: 'Wish updated successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the wish.' });
    }
});
exports.onUpdateWish = onUpdateWish;
