import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, SERVER_URL, EMAIL_HOST, CLIENT_URL } from '../constants';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const generateVerificationToken = (username: string, creator_id: string) => {
  // Generate a hash of the username
  const uuid = uuidv4() as string;
  const hash = crypto.createHash('sha256')
    .update(uuid)
    .digest('hex')
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign({ hash, username, creator_id }, REFRESH_TOKEN_SECRET as string, { expiresIn: '1h' }); // Set to 1 hour
  return token;
};

const sendVerificationEmail = (email: string, token: string) => { 
  // Send a verification email
  const mailOptions = {
    from: `Wishties 🎁` + EMAIL_HOST,
    to: email,
    subject: 'Email Verification',
    html: `<p> 
    Thanks for creating a Wishties account. Verify your email address so that you can get up and running quickly.
    <br>
    <br>
    Click the following link to do so:
    <a href="${CLIENT_URL}/verify-email/${token}">Verify Email</a></p>`,
  };
  return mailOptions;
};

const isValidAuthToken = (authToken: string) => {
  try {
    jwt.verify(authToken, REFRESH_TOKEN_SECRET as string);
    return true;
  } catch (error) {
    return false;
  }
}
 

export { generateVerificationToken, sendVerificationEmail, isValidAuthToken };
