import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../constants';

const generateVerificationToken = (username: string) => {
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' }); // Set to 1 hour
  return token;
};

export { generateVerificationToken };
