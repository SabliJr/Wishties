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
exports.onDeleteSocialLink = exports.onAddSocialLinks = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const db_1 = require("../db");
const onAddSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const socialLinks = req.body;
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, constants_1.REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const creator_id = decoded.creator_id;
    try {
        const creator = yield (0, db_1.query)('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
        if (creator.rows.length === 0) {
            return res.status(404).json({
                error: 'unauthorized'
            });
        }
        const links = yield (0, db_1.query)('SELECT * FROM social_media_links WHERE creator_id = $1', [creator_id]);
        const existingLinksMap = new Map();
        for (const link of links.rows) {
            existingLinksMap.set(link.platform_link, link);
        }
        for (const socialLink of socialLinks) {
            const { link_id, platform_icon, platform_name, platform_link } = socialLink;
            if (existingLinksMap.has(platform_link)) {
                continue;
            }
            yield (0, db_1.query)('INSERT INTO social_media_links (link_id, creator_id, platform_icon, platform_name, platform_link) VALUES ($1, $2, $3, $4, $5)', [link_id, creator_id, platform_icon, platform_name, platform_link]);
        }
        res.status(201).json({ message: 'Links added successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the links.' });
    }
});
exports.onAddSocialLinks = onAddSocialLinks;
const onDeleteSocialLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, constants_1.REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { link_id } = req.query;
    try {
        yield (0, db_1.query)('DELETE FROM social_media_links WHERE link_id = $1', [link_id]);
        res.status(200).json({ message: 'Link deleted successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the link.' });
    }
});
exports.onDeleteSocialLink = onDeleteSocialLink;
