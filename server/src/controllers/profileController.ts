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
    if (cover_photo[0]) {
      let isCoverImage = await query('SELECT cover_image FROM creator WHERE creator_id = $1', [creator_id]);
      console.log('This is the cover image');
      console.log(isCoverImage.rows[0].cover_image);

      if (isCoverImage.rows[0].cover_image) {
        const isDeleted = await onDeleteImage(`${COVER_IMAGES_FOLDER}/${isCoverImage.rows[0].cover_image}`);
        if (!isDeleted.status) {
          return res.status(500).json({
            message: isDeleted.message
          });
        }
      }

      const isUploaded = await onUploadImage(cover_photo[0]);
      if (!isUploaded.status) {
        return res.status(500).json({
          message: isUploaded.message
        });
      }
      cover_image = isUploaded.imageUrl;
    } else if (profile_photo[0]) {
      let isProfileImage = await query('SELECT profile_image FROM creator WHERE creator_id = $1', [creator_id]);
      console.log('This is the profile image')
      console.log(isProfileImage.rows[0].profile_image);

      if (isProfileImage.rows[0].profile_image) {
        const isDeleted = await onDeleteImage(`${PROFILES_IMAGES_FOLDER}/${isProfileImage.rows[0].profile_image}`);
        if (!isDeleted.status) {
          return res.status(500).json({
            message: isDeleted.message
          });
        }
      }

      const isUploaded = await onUploadImage(profile_photo[0]);
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
    queryText = queryText.slice(0, -1);

    queryText += ` WHERE creator_id = $${index} RETURNING *`;
    values.push(creator_id);

    // const { rows } = await query(queryText, values);
    console.log(queryText);
    console.log(values);

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

export { onUpdateProfile, onCheckUsername }; 
