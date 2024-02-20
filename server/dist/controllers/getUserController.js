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
exports.onGetCreatorInfoCart = exports.onGetCreatorData = exports.getCreator = void 0;
const db_1 = require("../db");
const constants_1 = require("../constants");
const jsonwebtoken_1 = require("jsonwebtoken");
const getCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const creator_username = req.query.username;
    if (!creator_username)
        return res.status(400).send('Bad Request');
    try {
        const user_info = yield (0, db_1.query)('SELECT * FROM creator WHERE username=$1', [creator_username]);
        if (!user_info.rows.length)
            return res.status(404).send('Creator not found');
        let creator_id = (_a = user_info.rows[0]) === null || _a === void 0 ? void 0 : _a.creator_id;
        const user_links = yield (0, db_1.query)('SELECT * FROM social_media_links WHERE creator_id = $1', [creator_id]);
        const user_wishes = yield (0, db_1.query)('SELECT * FROM wishes WHERE creator_id = $1', [creator_id]);
        let creator_info = {
            creator_name: user_info.rows[0].creator_name,
            username: user_info.rows[0].username,
            creator_bio: user_info.rows[0].creator_bio,
            creator_id: user_info.rows[0].creator_id,
            profile_image: user_info.rows[0].profile_image,
            cover_image: user_info.rows[0].cover_image,
            is_stripe_connected: user_info.rows[0].is_stripe_connected,
        };
        let creator_wishes = user_wishes.rows.map((wish) => {
            return {
                wish_name: wish.wish_name,
                wish_image: wish.wish_image,
                wish_price: wish.wish_price,
                wish_category: wish.wish_category,
                wish_id: wish.wish_id,
                created_date: wish.created_date,
                creator_id: wish.creator_id,
                wish_type: wish.wish_type,
            };
        });
        let creator_links = user_links.rows.map((link) => {
            return {
                link_id: link.link_id,
                platform_icon: link.platform_icon,
                platform_name: link.platform_name,
                platform_link: link.platform_link,
            };
        });
        res.status(200).json({
            user_info: creator_info,
            user_links: creator_links,
            user_wishes: creator_wishes,
        }); // Assuming you want to send the result as JSON
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getCreator = getCreator;
const onGetCreatorData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const creator = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        if (creator.rows.length === 0) {
            return res.status(404).json({
                error: 'unauthorized'
            });
        }
        const wishes = yield (0, db_1.query)('SELECT * FROM wishes WHERE creator_id = $1', [creator_id]);
        const links = yield (0, db_1.query)('SELECT * FROM social_media_links WHERE creator_id = $1', [creator_id]);
        const la_info = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        let creator_wishes = wishes.rows;
        let creator_links = links.rows;
        let creator_info = la_info.rows[0];
        res.status(200).json({
            user_info: creator_info,
            user_links: creator_links,
            user_wishes: creator_wishes,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the wishes.' });
    }
});
exports.onGetCreatorData = onGetCreatorData;
const onGetCreatorInfoCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let creator_id = req.query.creator_id;
    if (!creator_id)
        return res.status(400).send('Bad Request');
    try {
        const creator = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        if (creator.rows.length === 0) {
            return res.status(404).json({ error: 'Creator not found' });
        }
        let creator_info = {
            creator_name: creator.rows[0].creator_name,
            username: creator.rows[0].username,
            creator_id: creator.rows[0].creator_id,
            stripe_account_id: creator.rows[0].stripe_account_id,
        };
        res.status(200).json({ creator: creator_info });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while getting creator info.' });
    }
});
exports.onGetCreatorInfoCart = onGetCreatorInfoCart;
