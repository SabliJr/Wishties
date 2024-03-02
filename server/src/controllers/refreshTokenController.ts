import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, ACCESS_SECRET_KEY } from '../constants';
import { query } from '../db';

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  try {
    const decoded = await jwt.verify(refreshToken as string, REFRESH_TOKEN_SECRET as string);
    const { creator_id: id } = decoded as { username: string, exp: number, creator_id: string };

    let user = await query('SELECT * FROM creator WHERE creator_id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'User not found',
      });
    }

    const accessToken = jwt.sign({ creator_id: id, username: user.rows[0].username }, ACCESS_SECRET_KEY as string, { expiresIn: '30m' });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        creator_id: user.rows[0].creator_id,
        username: user.rows[0].username,
      },
    });

  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'The verification link has expired. Please register again.',
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please register again.',
      });
    } else {
      console.error('Error during token verification:', err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong, please try again.',
      });
    }
  }

}

export { handleRefreshToken }