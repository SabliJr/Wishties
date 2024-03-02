import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
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

  let cover_image: string | undefined;
  let profile_image: string | undefined;
  const { creator_id } = payload;
  const { profile_photo, cover_photo } = req.files as any;
  const { profile_name, profile_username, profile_bio } = req.body;

  try {
    if (cover_photo && cover_photo[0]) {
      let isCoverImage = await query('SELECT cover_image FROM creator WHERE creator_id = $1', [creator_id]);
      
      if (isCoverImage.rows[0].cover_image) {
        let old_cover_image = isCoverImage.rows[0].cover_image;
        old_cover_image = old_cover_image.split('/')[4];
        const isDeleted = await onDeleteImage(`${COVER_IMAGES_FOLDER}/${old_cover_image}`);
        if (!isDeleted.status) {
          return res.status(500).json({
            message: isDeleted.message
          });
        }
      }

      const isUploaded = await onUploadImage(cover_photo[0], COVER_IMAGES_FOLDER as string);
      if (!isUploaded.status) {
        return res.status(500).json({
          message: isUploaded.message
        });
      }
      cover_image = isUploaded.imageUrl;
    }

    if (profile_photo && profile_photo[0]) {
      let isProfileImage = await query('SELECT profile_image FROM creator WHERE creator_id = $1', [creator_id]);
      
      if (isProfileImage.rows[0].profile_image) {
        let old_profile_image = isProfileImage.rows[0].profile_image;
        old_profile_image = old_profile_image.split('/')[4];
        const isDeleted = await onDeleteImage(`${PROFILES_IMAGES_FOLDER}/${old_profile_image}`);
        if (!isDeleted.status) {
          return res.status(500).json({
            message: isDeleted.message
          });
        }
      }

      const isUploaded = await onUploadImage(profile_photo[0], PROFILES_IMAGES_FOLDER as string);
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
      // Check if username already exists
      const usernameExists = await query('SELECT username FROM creator WHERE username = $1', [profile_username]);
      if (usernameExists.rows.length > 0) {
        return res.status(405).json({
          message: 'Username already exists'
        });
      }

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
    queryText = queryText?.slice(0, -1);

    queryText += ` WHERE creator_id = $${index}`;
    values.push(creator_id);

    await query(queryText, values);
    res.status(200).json({
      message: 'Profile updated successfully'
    }); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

const onCheckUsername = async (req: Request, res: Response) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { username } = req.query;

    const { rows } = await query('SELECT username FROM creator WHERE username = $1', [username]);
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

const onGetCreatorInfo = async (req: Request, res: Response) => {
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

    let creator_info = rows.map((creator: any) => {
      return {
        creator_id: creator.creator_id,
        creator_name: creator.creator_name,
        username: creator.username,
        creator_bio: creator.creator_bio,
        profile_image: creator.profile_image,
        creator_email: creator.creator_email,
      }
    });

    res.status(200).json({
      message: 'Creator profile',
      creator: creator_info
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

export { onUpdateProfile, onCheckUsername, onGetCreatorInfo }; 
