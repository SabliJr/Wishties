import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, ACCESS_SECRET_KEY } from '../constants';
import { query } from '../db';

interface DecodedToken {
  username: string;
  email: string;
  [key: string]: any; // for any other properties that might be in the token
}

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET as string,
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        res.sendStatus(403);
        return;
      }

    const payload = decoded as DecodedToken;
    const username = payload.username;
    const email = payload.email;
    const creator_username = payload.username;
    let creator_id = payload.creator_id;

       // Now you can use username and email to query the database
    query('SELECT * FROM creator WHERE email = $1', [email])
      .then(found_user => {
        if (!found_user) {
          return res.sendStatus(403); //Forbidden
        }
        // Generate a new access token
        const accessToken = jwt.sign(
          { username: creator_username },
          ACCESS_SECRET_KEY as string,
          { expiresIn: '30m' }
        );

        // Send the new access token
          res.json({
            accessToken,
            user: {
              username,
              creator_id
        }});
      })
      .catch(err => {
        // Handle error
        console.error(err);
        res.sendStatus(500); // Internal Server Error
      });
    }
  );

}

export { handleRefreshToken }