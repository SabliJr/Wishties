import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { PORT, CLIENT_URL } from './constants';
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
  origin: {
    'https://wishties-backend.onrender.com': true,
    'https://wishties-backend.onrender.com/api': true,
    'https://wishties-backend.onrender.com/api/': true,
    'https://wishties-backend.onrender.com/api/*': true,
    'https://wishties-backend.onrender.com/*': true,
    'https://wishties.com': true,
    'https://wishties.com/api': true,
    'https://wishties.com/api/': true,
    'https://wishties.com/api/*': true,
    'https://wishties.com/*': true,
    'https://wishties-frontend.onrender.com': true,
    'https://wishties-frontend.onrender.com/api': true,
    'https://wishties-frontend.onrender.com/api/': true,
    'https://wishties-frontend.onrender.com/api/*': true,
    'https://wishties-frontend.onrender.com/*': true,
  },
  optionsSuccessStatus: 204,
  exposedHeaders: ['set-cookie', 'ajax_redirect'],
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