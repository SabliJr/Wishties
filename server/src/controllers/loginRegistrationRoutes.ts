import { query } from '../db';
import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { SECRET_KEY } from '../constants';
import jwt from 'jsonwebtoken';

import { generateUniqueUsername } from '../util/genUniqueUsername';
import { generateVerificationToken } from '../util/verificationfunctions';
import transporter from '../util/NodemailerConfig';

// User Registration
const userRegistration = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const pwd = await hash(password, 12);
    const username = await generateUniqueUsername(name);

    await query('INSERT INTO creator (creator_name, email, pwd, username) VALUES ($1, $2, $3, $4)', [
      name, email, pwd, username
    ]);

    const verificationToken = generateVerificationToken(username);

    const mailOptions = {
      from: process.env.EMAIL_HOST,
      to: email, // Replace with the user's email from the registration data
      subject: 'Email Verification',
      html: `<p>Click the following link to verify your email: <a href="http://wishties.com/verify/${verificationToken}">Verify Email</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);

    res.status(201).json({
      success: true,
      message: 'The registration was successful. Please check your email for verification.'
    });
  } catch (error: any) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message, // or any relevant information from the error
    });
  }
};

// Email Verification
const emailVerification = async (req: Request, res: Response) => { 
  try {
    const { token } = req.params;

    const decoded = await jwt.verify(token, SECRET_KEY);
    const { creator_id } = decoded as { creator_id: number };
    await query('UPDATE creator SET is_verified = TRUE WHERE creator_id = $1', [creator_id]);

    // Redirect to the creator's wishlist page
    const username = await query('SELECT username FROM creator WHERE creator_id = $1', [creator_id]);
    res.redirect(`http://wishties.com/wishlist/${username}`);
  } catch (error: any) {
    console.error('Error during email verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message, // or any relevant information from the error
    });
  }
};

// this is for requesting verification again
const reverifyEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const userResult = await query('SELECT * FROM creator WHERE email = $1', [email]);
    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const username = userResult.rows[0].username; // Extract username from the result
    const newVerificationToken = generateVerificationToken(username);  // Generate a new verification token

    // Update the existing token in the database (if you store it there)
    await query('UPDATE creator SET verification_token = $1 WHERE email = $2', [
      newVerificationToken,
      email,
    ]);

    // Send a new verification email
    const mailOptions = {
      from: process.env.EMAIL_HOST,
      to: email,
      subject: 'Email Verification',
      html: `<p>Click the following link to verify your email: <a href="http://wishties.com/verify/${newVerificationToken}">Verify Email</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('New verification email sent:', info.response);

    res.status(200).json({
      success: true,
      message: 'A new verification email has been sent. Please check your email for verification.',
    });
  } catch (error: any) {
    console.error('Error during requesting verification again:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
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

  export { userRegistration, userLogin, userLogout, emailVerification, reverifyEmail };
