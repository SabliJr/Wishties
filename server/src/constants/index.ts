import dotenv from 'dotenv';

dotenv.config();

  const PORT = process.env.PORT || 8000;
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000';
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export {
  PORT,
  CLIENT_URL,
  SERVER_URL,
  NODE_ENV,
  SECRET_KEY
}