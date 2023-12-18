import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, SERVER_URL, EMAIL_HOST, CLIENT_URL } from '../constants';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const generateVerificationToken = (username: string, email: string) => {
  // Generate a hash of the username
  const uuid = uuidv4() as string;
  const hash = crypto.createHash('sha256')
    .update(uuid)
    .digest('hex')
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign({ hash, username, email }, REFRESH_TOKEN_SECRET as string, { expiresIn: '3h' }); // Set to 1 hour
  return token;
};

const sendVerificationEmail = (email: string, token: string) => { 
  // Send a verification email
  const mailOptions = {
    from: `Wishties 🎁` + EMAIL_HOST,
    to: email,
    subject: 'Email Verification',
    html: `<p>Click the following link to verify your email:
    <a href="${CLIENT_URL}/verify-email/${token}">Verify Email</a></p>`,
  };
  return mailOptions;
};


export { generateVerificationToken, sendVerificationEmail };
