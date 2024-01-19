import { Request, Response } from 'express';
import { query } from '../db';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, PROFILES_IMAGES_FOLDER, COVER_IMAGES_FOLDER } from '../constants';
import { onDeleteImage, onUploadImage } from '../config/s3';

interface DecodedToken {
  username: string;
  creator_name: string;
  creator_id: string;
  [key: string]: any; // for any other properties that might be in the token
}

const getCreators = async (req: Request, res: Response) => {
  const creator_username = req.query.username;

  try {
    const  user_info  = await query('SELECT * FROM creator WHERE username=$1', [creator_username]);
    if (!user_info.rows.length)
      return res.status(404).send('Creator not found');

    let creator_id = user_info.rows[0]?.creator_id;
    const user_links = await query('SELECT * FROM social_media_links WHERE creator_id = $1', [creator_id]);
    const user_wishes = await query('SELECT * FROM wishes WHERE creator_id = $1', [creator_id]);

    res.status(200).json({
      user_info: user_info.rows[0],
      user_links: user_links.rows,
      user_wishes: user_wishes.rows
    }); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const onCreatorInfo = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    return res.status(401).send('Unauthorized');
  let refreshToken = cookie.refreshToken;

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const { creator_id } = payload;
    const { rows } = await query('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);

    res.status(200).json(rows[0]); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}


export { getCreators, onCreatorInfo };