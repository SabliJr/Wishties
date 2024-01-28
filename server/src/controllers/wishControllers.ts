import { Request, Response } from 'express';
import { REFRESH_TOKEN_SECRET } from '../constants';
import { query } from '../db/index';
import { verify } from 'jsonwebtoken';
import { onUploadImage, onDeleteImage } from '../config/s3'; 
import { WISHES_IMAGES_FOLDER } from '../constants';

interface DecodedToken {
  username: string;
  creator_name: string;
  creator_id: string;
  [key: string]: any; // for any other properties that might be in the token
}

const onAddWish = async (req: Request, res: Response) => {
  const { wish_name, wish_price, wish_category } = req.body;
  const wish_image = req.file;

  const isUploaded = await onUploadImage(wish_image, WISHES_IMAGES_FOLDER as string);
  if (!isUploaded.status)
    return res.status(500).json({
      error: isUploaded.message
    });

  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  // Verify the user's refresh token and get the user's username and email before sending the wish to the database;
  let decoded;
  try {
    decoded = verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }

  const { creator_id } = decoded;
  try {
    const creator = await query(
      'SELECT * FROM creator WHERE creator_id = $1', [creator_id]
    );
    if (creator.rows.length === 0) {
      return res.status(404).json({
        error: 'unauthorized'
      });
    }

    await query(
      'INSERT INTO wishes (wish_name, wish_price, wish_image, wish_category, creator_id) VALUES ($1, $2, $3, $4, $5)',
      [wish_name, wish_price, isUploaded.imageUrl, wish_category, creator_id]
    );
    res.status(201).json({ message: 'Wish added successfully.'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the wish.' });
  }
}

const onDeleteWish = async (req: Request, res: Response) => {
  const { wish_id } = req.query;
  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  // Verify the user's refresh token and get the user's username and email before sending the wish to the database;
  let decoded;
  try {
    decoded = verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }

  const { creator_id } = decoded;
  try {
    const creator = await query(
      'SELECT * FROM creator WHERE creator_id = $1', [creator_id]
    );
    if (creator.rows.length === 0) {
      return res.status(404).json({
        error: 'unauthorized'
      });
    }

    const wish = await query(
      'SELECT * FROM wishes WHERE wish_id = $1', [wish_id]
    );
    if (wish.rows.length === 0) {
      return res.status(404).json({
        error: 'Wish not found.'
      });
    }

    let wish_image = wish.rows[0].wish_image;
    wish_image = wish_image.split('/')[4];
    let isDeleted = await onDeleteImage(`${WISHES_IMAGES_FOLDER}/${wish_image}`);
    if (!isDeleted.status)
      return res.status(500).json({
        error: isDeleted.message
      });

    await query(
      'DELETE FROM wishes WHERE wish_id = $1', [wish_id]
    );
    res.status(200).json({ message: 'Wish deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the wish.' });
  }
}

const onUpdateWish = async (req: Request, res: Response) => {
  let { wish_id, wish_name, wish_price, wish_category } = req.body;
  let wish_image;
  let wish_image_file = req.file;

  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);

  const refreshToken = cookies.refreshToken;
  let decoded;
  try {
    decoded = verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }

  const { creator_id } = decoded;
  try {
    const creator = await query(
      'SELECT * FROM creator WHERE creator_id = $1', [creator_id]
    );
    if (creator.rows.length === 0) {
      return res.status(404).json({
        error: 'unauthorized'
      });
    }

    const wish = await query(
      'SELECT * FROM wishes WHERE wish_id = $1', [wish_id]
    );
    if (wish.rows.length === 0) {
      return res.status(404).json({
        error: 'Wish not found.'
      });
    }

    if (wish_image_file) {
      let isDeleted = await onDeleteImage(`${WISHES_IMAGES_FOLDER}/${wish_image_file}`);
      if (!isDeleted.status)
        return res.status(500).json({
          error: isDeleted.message
        });
      
      const isUploaded = await onUploadImage(wish_image_file, WISHES_IMAGES_FOLDER as string);
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

    await query(queryText, queryValues);
    res.status(200).json({ message: 'Wish updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating the wish.' });
  }

}

export { onAddWish, onDeleteWish, onUpdateWish };