import { query } from '../db';
import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET, CLIENT_URL} from '../constants';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { generateUniqueUsername } from '../util/genUniqueUsername';
import { generateVerificationToken, sendVerificationEmail } from '../util/verificationFunctions';
import transporter from '../util/NodemailerConfig';

// User Registration
const userRegistration = async (req: Request, res: Response) => {
  const { creator_name, email, password } = req.body;

  try {
    let  creator_id = uuidv4();
    const pwd = await hash(password, 12);
    const username = await generateUniqueUsername(creator_name);
    const verificationToken = generateVerificationToken(username, creator_id);

    await query(
      'INSERT INTO creator (creator_id, creator_name, email, pwd, username, verification_token) VALUES($1, $2, $3, $4, $5, $6)',
      [creator_id, creator_name, email, pwd, username, verificationToken ]);

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
    const { token } = req.query;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'The verification link is invalid.',
      });
    }

    // Verify the token with a custom clock timestamp
    const currentTime = Math.floor(Date.now() / 1000);
    const decoded = await jwt.verify(token as string, REFRESH_TOKEN_SECRET as string, {
      clockTimestamp: currentTime,
    });
    const { creator_id: id, exp } = decoded as { username: string, exp: number, creator_id: string };

    // Check if the token has expired
    if (exp && exp < currentTime) {
      return res.status(401).json({
        success: false,
        message: 'The verification link has expired. Please register again.',
      });
    }

    // update the verification status in the database
    await query('UPDATE creator SET is_verified = TRUE WHERE creator_id = $1', [id]);
    const la_creator = await query('SELECT * FROM creator WHERE creator_id = $1', [id]);
    const { creator_id, creator_name } = la_creator.rows[0];

      // Create an access token that expires in 30  minutes
    const accessToken = await jwt.sign(
      { creator_id, creator_name },
      ACCESS_SECRET_KEY as string,
      { expiresIn: '10m' }
    );

    // Redirect to the creator's wishlist page
    res.status(202).cookie('refreshToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      path: '/',
      // sameSite: 'strict',
      httpOnly: true,
      secure: true,
      // domain: '.wishties.com',
    }).json({
      success: true,
      message: 'The verification was successful!',
      user: {
        creator_id: la_creator.rows[0].creator_id,
        username: la_creator.rows[0].username,
      },
      accessToken: accessToken,
      role: 'creator',
      redirectURL: `${CLIENT_URL}/edit-profile/${la_creator.rows[0].username}`
    });
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

    const creator_id = userResult.rows[0].creator_id;
    const username = userResult.rows[0].username; // Extract username from the result
    const newVerificationToken = generateVerificationToken(username, creator_id);  // Generate a new verification token

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
  const { creator } = req.body;

  try {
    const { creator_id, creator_name, email, username } = creator;

    // Check if the creator is verified, if not, send a new verification email.
    const is_verified = await query('SELECT is_verified FROM creator WHERE email = $1', [email]);
    if (!is_verified.rows[0].is_verified) {
       const newVerificationToken = generateVerificationToken(username, creator_id);
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

    // Create an access token that expires in 30  minutes
    const accessToken = await jwt.sign(
      { creator_id, creator_name, username },
      ACCESS_SECRET_KEY as string,
      { expiresIn: '30m' }
    );

    // Create a refresh token that expires in 10 days
    const refreshToken = await jwt.sign(
      { creator_id, creator_name, username },
      REFRESH_TOKEN_SECRET as string,
      { expiresIn: '10d' }
    );

    const la_creator = await query('SELECT * FROM creator WHERE email = $1', [email]);
    res.status(202).cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      path: '/',
      // sameSite: 'strict',
      httpOnly: true,
      // domain: '.wishties.com',
      secure: true
    }).json({
      success: true,
      message: 'The login was successful!',
      user: {
        creator_id: la_creator.rows[0].creator_id,
        username: la_creator.rows[0].username,
      },
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong, please try again.');
  }
};

// Logout creator
// const userLogout = async (req: Request, res: Response) => { 
//   try {
//     res.status(200).clearCookie('refreshToken').json({
//       success: true,
//       message: 'logged out successfully!',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Something went wrong, please try again.');
//   }
// };

// Assuming you have a function to add tokens to a blacklist
// This function should store the tokens in a database or some other persistent storage
// The implementation of this function will depend on how you're storing your data
async function addToBlacklist(token: string) {
  // Implementation here
}

// Logout creator
const userLogout = async (req: Request, res: Response) => { 
  try {
    // Get the token from the request
    // This will depend on how you're sending the token (e.g., in the Authorization header, in a cookie, etc.)
    const token = req.cookies.refreshToken;

    // Add the token to the blacklist
    // await addToBlacklist(token);
    // Clear the refreshToken cookie
    res.clearCookie('refreshToken', {
      secure: true,
      sameSite: 'none',
    });
    // Send the success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again.',
    });
  }
};

  export { userRegistration, userLogin, userLogout, emailVerification, reverifyEmail };
