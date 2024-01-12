import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000';
const NODE_ENV = process.env.NODE_ENV || 'development';
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const EMAIL_HOST = process.env.EMAIL_HOST;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_REGION = process.env.S3_REGION;
const S3_URL = process.env.S3_URL;
const WISHES_IMAGES_FOLDER = process.env.WISHES_IMAGES_FOLDER;
const COVER_IMAGES_FOLDER = process.env.COVER_IMAGES_FOLDER;
const PROFILES_IMAGES_FOLDER = process.env.PROFILES_IMAGES_FOLDER;

export {
  PORT,
  CLIENT_URL,
  SERVER_URL,
  NODE_ENV,
  ACCESS_SECRET_KEY,
  EMAIL_HOST,
  REFRESH_TOKEN_SECRET,
  S3_BUCKET_NAME,
  S3_SECRET_ACCESS_KEY,
  S3_ACCESS_KEY,
  S3_REGION,
  S3_URL,
  WISHES_IMAGES_FOLDER,
  PROFILES_IMAGES_FOLDER,
  COVER_IMAGES_FOLDER,
}