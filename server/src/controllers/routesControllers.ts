import { query } from '../db';
import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { SECRET_KEY } from '../constants';
import jwt from 'jsonwebtoken';

const getRoutes = async (req: Request, res: Response) => {
  try {
    const { rows } = await query('SELECT * FROM creator', []);
    console.log(rows);
    res.status(200).json(rows); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const userRegistration = async (req: Request, res: Response) => {
  const {creator_name, email, password } = req.body;
  
  try {
    const hashedPassword = await hash(password, 12);

    await query('INSERT INTO creator (creator_name, email, creator_password) VALUES ($1, $2, $3)', [
      creator_name, email, hashedPassword
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

const userLogout = async (req: Request, res: Response) => { 
  try {
    res.status(200).clearCookie('token').json({
      success: true,
      message: 'The logout was successful!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export { getRoutes, userRegistration, userLogin, userLogout};
