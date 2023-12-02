import { query } from '../db';
import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { SECRET_KEY } from '../constants';
import jwt from 'jsonwebtoken';

import { generateUniqueUsername } from '../util/genUniqueUsername';

const getRoutes = async (req: Request, res: Response) => {
  try {
    const { rows } = await query('SELECT * FROM creator', []);

    res.status(200).json(rows); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Register creator
const userRegistration = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    const pwd = await hash(password, 12);
    const username = await generateUniqueUsername(name);

    await query('INSERT INTO creator (creator_name, email, pwd, username) VALUES ($1, $2, $3, $4)', [
      name, email, pwd, username
    ]);

    res.status(201).json({
      success: true,
      message: 'The registration was successful!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Login creator
const userLogin = async (req: Request, res: Response) => { 
  try {
    const { creator } = req.body;
    const { creator_id, creator_name, email } = creator;
    const token = await jwt.sign({ creator_id, creator_name, email }, SECRET_KEY, { expiresIn: '12d' });

    res.status(200).cookie('token', token, { httpOnly: true}).json({
      success: true,
      message: 'The login was successful!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Logout creator
const userLogout = async (req: Request, res: Response) => { 
  try {
    res.status(200).clearCookie('token').json({
      success: true,
      message: 'logged out successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export { getRoutes, userRegistration, userLogin, userLogout};
