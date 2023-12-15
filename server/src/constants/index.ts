import dotenv from 'dotenv';

dotenv.config();

  const PORT = process.env.PORT || 8000;
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000';
  const NODE_ENV = process.env.NODE_ENV || 'development';
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  const EMAIL_HOST = process.env.EMAIL_HOST;

export {
  PORT,
  CLIENT_URL,
  SERVER_URL,
  NODE_ENV,
  ACCESS_SECRET_KEY,
  EMAIL_HOST,
  REFRESH_TOKEN_SECRET
}