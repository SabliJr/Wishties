import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../constants';
import crypto from 'crypto';

const generateVerificationToken = (username: string) => {
  // Generate a hash of the username
  const hash = crypto.createHash('sha256')
    .update(username)
    .digest('hex')
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign({ hash }, SECRET_KEY, { expiresIn: '1h' }); // Set to 1 hour
  return token;
};


export { generateVerificationToken };
