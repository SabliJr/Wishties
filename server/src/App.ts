import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//For env File 
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});