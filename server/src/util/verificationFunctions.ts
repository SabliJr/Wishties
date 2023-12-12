import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../constants';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const generateVerificationToken = (email: string) => {
  // Generate a hash of the username
  const uuid = uuidv4() as string;
  const hash = crypto.createHash('sha256')
    .update(uuid)
    .digest('hex')
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign({ hash, email }, SECRET_KEY, { expiresIn: '3h' }); // Set to 1 hour
  console.log('token', token);
  return token;
};


export { generateVerificationToken };
