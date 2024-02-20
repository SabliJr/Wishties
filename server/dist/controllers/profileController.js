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
exports.onGetCreatorInfo = exports.onCheckUsername = exports.onUpdateProfile = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const s3_1 = require("../config/s3");
const onUpdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    if (!cookie.refreshToken)
        return res.status(401).send('Unauthorized');
    let refreshToken = cookie.refreshToken;
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, constants_1.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send('Unauthorized');
    }
    let cover_image;
    let profile_image;
    const { creator_id } = payload;
    const { profile_photo, cover_photo } = req.files;
    const { profile_name, profile_username, profile_bio } = req.body;
    try {
        if (cover_photo && cover_photo[0]) {
            let isCoverImage = yield (0, db_1.query)('SELECT cover_image FROM creator WHERE creator_id = $1', [creator_id]);
            if (isCoverImage.rows[0].cover_image) {
                let old_cover_image = isCoverImage.rows[0].cover_image;
                old_cover_image = old_cover_image.split('/')[4];
                const isDeleted = yield (0, s3_1.onDeleteImage)(`${constants_1.COVER_IMAGES_FOLDER}/${old_cover_image}`);
                if (!isDeleted.status) {
                    return res.status(500).json({
                        message: isDeleted.message
                    });
                }
            }
            const isUploaded = yield (0, s3_1.onUploadImage)(cover_photo[0], constants_1.COVER_IMAGES_FOLDER);
            if (!isUploaded.status) {
                return res.status(500).json({
                    message: isUploaded.message
                });
            }
            cover_image = isUploaded.imageUrl;
        }
        if (profile_photo && profile_photo[0]) {
            let isProfileImage = yield (0, db_1.query)('SELECT profile_image FROM creator WHERE creator_id = $1', [creator_id]);
            if (isProfileImage.rows[0].profile_image) {
                let old_profile_image = isProfileImage.rows[0].profile_image;
                old_profile_image = old_profile_image.split('/')[4];
                const isDeleted = yield (0, s3_1.onDeleteImage)(`${constants_1.PROFILES_IMAGES_FOLDER}/${old_profile_image}`);
                if (!isDeleted.status) {
                    return res.status(500).json({
                        message: isDeleted.message
                    });
                }
            }
            const isUploaded = yield (0, s3_1.onUploadImage)(profile_photo[0], constants_1.PROFILES_IMAGES_FOLDER);
            if (!isUploaded.status) {
                return res.status(500).json({
                    message: isUploaded.message
                });
            }
            profile_image = isUploaded.imageUrl;
        }
        let queryText = 'UPDATE creator SET';
        let values = [];
        let index = 1;
        if (profile_name !== undefined) {
            queryText += ` creator_name = $${index},`;
            values.push(profile_name);
            index++;
        }
        if (profile_username !== undefined) {
            queryText += ` username = $${index},`;
            values.push(profile_username);
            index++;
        }
        if (profile_bio !== undefined) {
            queryText += ` creator_bio = $${index},`;
            values.push(profile_bio);
            index++;
        }
        if (profile_image !== undefined) {
            queryText += ` profile_image = $${index},`;
            values.push(profile_image);
            index++;
        }
        if (cover_image !== undefined) {
            queryText += ` cover_image = $${index},`;
            values.push(cover_image);
            index++;
        }
        // Remove the last comma
        queryText = queryText === null || queryText === void 0 ? void 0 : queryText.slice(0, -1);
        queryText += ` WHERE creator_id = $${index}`;
        values.push(creator_id);
        yield (0, db_1.query)(queryText, values);
        res.status(200).json({
            message: 'Profile updated successfully'
        }); // Assuming you want to send the result as JSON
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
exports.onUpdateProfile = onUpdateProfile;
const onCheckUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Input validation
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let { username } = req.query;
        const { rows } = yield (0, db_1.query)('SELECT username FROM creator WHERE username = $1', [username]);
        if (rows.length > 0) {
            return res.status(409).json({
                message: 'Username already exists',
                isExists: true
            });
        }
        res.status(200).json({
            message: 'Username is available',
            isExists: false
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
exports.onCheckUsername = onCheckUsername;
const onGetCreatorInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    if (!cookie.refreshToken)
        return res.status(401).send('Unauthorized');
    let refreshToken = cookie.refreshToken;
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, constants_1.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const { creator_id } = payload;
        const { rows } = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        let creator_info = rows.map((creator) => {
            return {
                creator_id: creator.creator_id,
                creator_name: creator.creator_name,
                username: creator.username,
                creator_bio: creator.creator_bio,
                profile_image: creator.profile_image,
                creator_email: creator.creator_email,
            };
        });
        res.status(200).json({
            message: 'Creator profile',
            creator: creator_info
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
exports.onGetCreatorInfo = onGetCreatorInfo;
