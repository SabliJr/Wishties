import Stripe from 'stripe';
import { STRIPES_SECRET_KEY } from '../constants/index';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPES_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export default stripe;