import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from '../constants';
import { query } from '../db';

interface DecodedToken {
  username: string;
  creator_name: string;
  creator_id: string;
  [key: string]: any; // for any other properties that might be in the token
}

const onAddSocialLinks = async (req: Request, res: Response) => {
     const socialLinks = req.body;
    const { refreshToken } = req.cookies;
     if (!refreshToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }

    const creator_id = decoded.creator_id;
    try {
        const creator = await query(
            'SELECT * FROM creator WHERE creator_id = $1', [creator_id]
        );
        if (creator.rows.length === 0) {
            return res.status(404).json({
                error: 'unauthorized'
            });
        }

        const links = await query(
            'SELECT * FROM social_media_links WHERE creator_id = $1', [creator_id]
        );
        const existingLinksMap = new Map();
        for (const link of links.rows) {
            existingLinksMap.set(link.platform_link, link);
        }

        for (const socialLink of socialLinks) {
            const { link_id, platform_icon, platform_name, platform_link } = socialLink;
            if (existingLinksMap.has(platform_link)) {
                continue;
            }

            await query(
                'INSERT INTO social_media_links (link_id, creator_id, platform_icon, platform_name, platform_link) VALUES ($1, $2, $3, $4, $5)',
                [link_id, creator_id, platform_icon, platform_name, platform_link]
            );
        }

        res.status(201).json({ message: 'Links added successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the links.' });
    }
}

const onDeleteSocialLink = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded: DecodedToken;
    try {
        decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { link_id } = req.query;
    try {
        await query('DELETE FROM social_media_links WHERE link_id = $1', [link_id]);
        res.status(200).json({ message: 'Link deleted successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the link.' });
    }
}

export { onAddSocialLinks, onDeleteSocialLink };