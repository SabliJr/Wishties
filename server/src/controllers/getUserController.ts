import { Request, Response } from 'express';
import { query } from '../db';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from '../constants';

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

const onUpdateProfile = async (req: Request, res: Response) => {
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

  // let profile_photo = req.files as any;

  try {
    const { creator_id } = payload;
    const { profile_photo, cover_photo } = req.files as any;
    console.log(profile_photo[0]);
    console.log(cover_photo[0]);
    console.log(req.body);
    // console.log(req.files);
    // const { profile_name, profile_username, profile_bio } = req.body;
    // const { rows } = await query('UPDATE creator SET creator_name = $1, username = $2, creator_bio = $3 WHERE creator_id = $4 RETURNING *', [profile_name, profile_username, profile_bio, creator_id]);

    res.status(200).json({
      message: 'Profile updated successfully'
    }); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

export { getCreators, onCreatorInfo, onUpdateProfile };