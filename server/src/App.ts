import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { PORT, CLIENT_URL } from './constants';
import router from './routes/appRoutes';

//For env File 
dotenv.config();

const app: Application = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: CLIENT_URL,
  optionsSuccessStatus: 200
}));

// Routes
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});