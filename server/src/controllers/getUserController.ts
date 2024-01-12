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
  try {
    const { rows } = await query('SELECT * FROM creator', []);

    res.status(200).json(rows); // Assuming you want to send the result as JSON
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