import { Request, Response } from 'express';
import { query } from '../db';

const getCreators = async (req: Request, res: Response) => {
  try {
    const { rows } = await query('SELECT * FROM creator', []);

    res.status(200).json(rows); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export { getCreators };