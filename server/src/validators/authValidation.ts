import { check } from 'express-validator';
import { query } from '../db';
import { compare } from 'bcryptjs';

const password = check('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long.');

  // Check if email is valid
const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid Email.');

  //Check if email already exists in the database
const emailExist = check('email').custom(
  async (value) => { 
    const { rows } = await query('SELECT * FROM creator WHERE email = $1', [value]);

    if (rows.length > 0) {
      throw new Error('Email already exists');
    }
});

// Check if email and password are valid
const loginCheck = check('email').custom(
  async (value, { req }) => { 
    const { rows } = await query('SELECT * FROM creator WHERE email = $1', [value]);

    if (rows.length === 0) {
      throw new Error('Invalid email or password.');
    }

    const { pwd } = rows[0];
    const isMatch = await compare(req.body.pwd, pwd);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    req.body.creator = rows[0];
});

const loginValidation = [loginCheck];
const registerValidation = [email, password, emailExist];

export { 
  registerValidation,
  loginValidation
 };