import { query } from '../db';
import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { CLIENT_URL, SECRET_KEY, SERVER_URL, EMAIL_HOST } from '../constants';
import jwt from 'jsonwebtoken';

import { generateUniqueUsername } from '../util/genUniqueUsername';
import { generateVerificationToken, sendVerificationEmail } from '../util/verificationFunctions';
import transporter from '../util/NodemailerConfig';

// User Registration
const userRegistration = async (req: Request, res: Response) => {
  const { creator_name, email, password } = req.body;

  try {
    const pwd = await hash(password, 12);
    const username = await generateUniqueUsername(creator_name);
    const verificationToken = generateVerificationToken(email);

    await query(
      'INSERT INTO creator (creator_name, email, pwd, username, verification_token) VALUES($1, $2, $3, $4, $5)',
      [ creator_name, email, pwd, username, verificationToken ]);

    const laMailOption = sendVerificationEmail(email as string, verificationToken);
    await transporter.sendMail(laMailOption);
    res.status(201).json({
      success: true,
      message: 'The registration was successful. Please check your email for verification.'
    });
  } catch (error: any) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again',
      error: error.message, // or any relevant information from the error
    });
  }
};

// Email Verification
const emailVerification = async (req: Request, res: Response) => { 
  try {
    const { token } = req.params;
    const decoded = await jwt.verify(token, SECRET_KEY);
    const { email, exp } = decoded as { email: string, exp: number };

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (exp && exp < currentTime) {
      return res.status(401).json({
        success: false,
        message: 'The verification link has expired. Please register again.',
      });
    }

    // update the verification status in the database
    await query('UPDATE creator SET is_verified = TRUE WHERE email = $1', [email]);

    // Redirect to the creator's wishlist page
    const username = await query('SELECT username FROM creator WHERE email = $1', [email]);
    let creator_name = username.rows[0].username;

    res.redirect(`${CLIENT_URL}/${creator_name}`);
  } catch (error: any) {
    console.error('Error during email verification:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again.',
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
        message: "User don't exist, please register.",
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
    const laMailOption = sendVerificationEmail(email as string, newVerificationToken);
    await transporter.sendMail(laMailOption);
    res.status(200).json({
      success: true,
      message: 'A new verification email has been sent, please check your email.',
    });
  } catch (error: any) {
    console.error('Error during requesting verification again:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again.',
      error: error.message,
    });
  }
};

// Login creator
const userLogin = async (req: Request, res: Response) => { 
  try {
    const { creator } = req.body;
    const { creator_id, creator_name, email } = creator;

    // Check if the creator is verified, if not, send a new verification email.
    const is_verified = await query('SELECT is_verified FROM creator WHERE email = $1', [email]);
    if (!is_verified.rows[0].is_verified) {
       const newVerificationToken = generateVerificationToken(email);
      // Check if the token was generated successfully
      if (!newVerificationToken) {
        return res.status(500).json({
          success: false,
          message: 'Something went wrong, please try again.',
        });
      }

      const emailSent = sendVerificationEmail(email as string, newVerificationToken);
      // Check if the email was sent successfully
      if (!emailSent) {
        return res.status(500).json({
          success: false,
          message: 'Something went wrong, please try again.',
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Please verify your email first, we have sent you a verification link.',
      });
    }

    const la_creator = await query('SELECT * FROM creator WHERE email = $1', [email]);
    const token = await jwt.sign({ creator_id, creator_name, email }, SECRET_KEY, { expiresIn: '10d' });
    res.status(202).cookie('token', token, {
       maxAge: 1000 * 60 * 60 * 24 * 10, path: '/', sameSite: 'strict',  httpOnly: true,  secure: true
    }).json({
      success: true,
      message: 'The login was successful!',
      user: {
        creator_id: la_creator.rows[0].creator_id,
        username: la_creator.rows[0].username,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong, please try again.');
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
    res.status(500).send('Something went wrong, please try again.');
  }
};

  export { userRegistration, userLogin, userLogout, emailVerification, reverifyEmail };
