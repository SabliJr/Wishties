import { Request, Response } from 'express';
import { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET, CLIENT_URL } from '../constants';
import { query } from '../db/index';
import { sign, verify } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { } from '@aws-sdk/client-s3'

const onAddWish = async (req: Request, res: Response) => {
  const { wish_name, wish_price, wish_category } = req.body;
  const wish_image = req.file;
  console.log(wish_name, wish_price, wish_category);
  console.log(wish_image);

  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  console.log(refreshToken);

  // Verify the user's refresh token and get the user's username and email before sending the wish to the database;

  //   const insertWishQuery = `
  //   INSERT INTO wish (wish_name, price, wish_image, wish_category)
  //   VALUES ($1, $2, $3, $4, $5, $6, $7)
  //   RETURNING *;
  // `;

 try {
    // const { rows } = await query(insertWishQuery, [wish_name, wish_price, wish_category]);
    // const createdWish = rows[0];
    res.status(201).json({ message: 'Wish added successfully.'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the wish.' });
  }
}

export { onAddWish };