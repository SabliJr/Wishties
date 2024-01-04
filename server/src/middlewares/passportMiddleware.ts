import passport from 'passport';
import { ACCESS_SECRET_KEY } from '../constants';
import { query } from '../db';
import { compare } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-jwt';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as TwitterStrategy } from 'passport-twitter';
// import { Strategy as AppleStrategy } from 'passport-apple';

const cookieExtractor = (req: Request) => { 
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
}

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: ACCESS_SECRET_KEY
};

passport.use(
  new LocalStrategy(options, async (payload: any, done: any) => { 
  try {
    const { rows } = await query(
      'SELECT * FROM creator WHERE creator_id = $1',
      [payload.creator_id]
    );

    if (rows.length === 0) {
      new Error('Invalid username or password.');
    }

    return done(null, rows[0]);
  } catch (error) {
    console.error(error);
    return done(error, false);
  }
}));