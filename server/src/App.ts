import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { PORT } from './constants';
import router from './routes/appRoutes';
import { IncomingMessage, ServerResponse } from 'http';


//For env File 
dotenv.config();

const app: Application = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody?: Buffer
  }
}

const corsOptions = {
  credentials: true,
  origin: [
    'https://wishties-backend.onrender.com',
    'https://wishties-backend.onrender.com/api',
    'https://wishties-backend.onrender.com/api/',
    'https://wishties-backend.onrender.com/api/*',
    'https://wishties-backend.onrender.com/*',
    'https://wishties.com',
    'https://www.wishties.com',
    'https://wishties.com/api',
    'https://wishties.com/api/',
    'https://wishties.com/api/*',
    'https://wishties.com/*',
    'https://wishties-frontend.onrender.com',
    'https://wishties-frontend.onrender.com/api',
    'https://wishties-frontend.onrender.com/api/',
    'https://wishties-frontend.onrender.com/api/*',
    'https://wishties-frontend.onrender.com/*',
    'https://api.wishties.com/api',
    'https://www.api.wishties.com/api',
    'https://api.wishties.com/api/',
    'https://www.api.wishties.com/api/',
    'https://api.wishties.com/api/*',
    'https://www.api.wishties.com/api/*',
    'https://api.wishties.com/*',
    'https://api.wishties.com',
    'https://www.wishties.com',
    'https://www.wishties.com/api',
    'https://www.wishties.com/api/',
    'https://www.wishties.com/api/*',
    'https://www.wishties.com/*',
    'https://www.wishties.com',
    // 'localhost:3000', //for development
    // 'http://localhost:3000', //for development
  ],
  optionsSuccessStatus: 204,
  exposedHeaders: ['Set-Cookie', 'ajax_redirect'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'XMLHttpRequest'],
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({
  verify: (req: IncomingMessage, res: ServerResponse, buf: Buffer) => {
    req.rawBody = buf;
  }
}));
app.use(express.json());

app.use(cors(corsOptions));
app.options('/api/verify-email/', cors()); // Respond to preflight requests


// Routes
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});