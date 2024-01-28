import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { PORT, CLIENT_URL } from './constants';
import router from './routes/appRoutes';

//For env File 
dotenv.config();

const app: Application = express();

const corsOptions = {
  credentials: true,
  origin: CLIENT_URL,
  optionsSuccessStatus: 204,
  exposedHeaders: ['set-cookie', 'ajax_redirect'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'XMLHttpRequest'],
};

app.use(cors(corsOptions));
app.options('/api/verify-email/', cors()); // Respond to preflight requests

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});