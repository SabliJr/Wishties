import { Request, Response } from 'express';
import { query } from '../db';
import { REFRESH_TOKEN_SECRET } from '../constants'
import { verify } from 'jsonwebtoken';

interface DecodedToken {
  username: string;
  creator_name: string;
  creator_id: string;
  [key: string]: any; // for any other properties that might be in the token
}

const getCreator = async (req: Request, res: Response) => {
  const creator_username = req.query.username;
  if (!creator_username) return res.status(400).send('Bad Request');

  try {
    const  user_info  = await query('SELECT * FROM creator WHERE username=$1', [creator_username]);
    if (!user_info.rows.length)
      return res.status(404).send('Creator not found');

    let creator_id = user_info.rows[0]?.creator_id;
    const user_links = await query('SELECT * FROM social_media_links WHERE creator_id = $1', [creator_id]);
    const user_wishes = await query('SELECT * FROM wishes WHERE creator_id = $1', [creator_id]);

    let creator_info = {
      creator_name: user_info.rows[0].creator_name,
      username: user_info.rows[0].username,
      creator_bio: user_info.rows[0].creator_bio,
      creator_id: user_info.rows[0].creator_id,
      profile_image: user_info.rows[0].profile_image,
      cover_image: user_info.rows[0].cover_image,
      is_stripe_connected: user_info.rows[0].is_stripe_connected,
    };

    let creator_wishes = user_wishes.rows.map((wish: any) => {
      return {
        wish_name: wish.wish_name,
        wish_image: wish.wish_image,
        wish_price: wish.wish_price,
        wish_category: wish.wish_category,
        wish_id: wish.wish_id,
        created_date: wish.created_date,
        creator_id: wish.creator_id,
        wish_type: wish.wish_type,
      }
    });

    let creator_links = user_links.rows.map((link: any) => {
      return {
        link_id: link.link_id,
        platform_icon: link.platform_icon,
        platform_name: link.platform_name,
        platform_link: link.platform_link,
      }
    });


    res.status(200).json({
      user_info: creator_info,
      user_links: creator_links,
      user_wishes: creator_wishes,
    }); // Assuming you want to send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const onGetCreatorData = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  // Verify the user's refresh token and get the user's username and email before sending the wish to the database;
  let decoded;
  try {
    decoded = verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }

  const { creator_id } = decoded;
  try {
    const creator = await query(
      'SELECT * FROM creator WHERE creator_id = $1', [creator_id]
    );
    if (creator.rows.length === 0) {
      return res.status(404).json({
        error: 'unauthorized'
      });
    }

    const wishes = await query(
      'SELECT * FROM wishes WHERE creator_id = $1', [creator_id]
    );
    const links = await query('SELECT * FROM social_media_links WHERE creator_id = $1', [creator_id]);
    const la_info = await query('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);

    let creator_wishes = wishes.rows;
    let creator_links = links.rows;
    let creator_info = la_info.rows[0];
    
    res.status(200).json({
      user_info: creator_info,
      user_links: creator_links,
      user_wishes: creator_wishes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the wishes.' });
  }
}

const onGetCreatorInfoCart = async (req: Request, res: Response) => {
  let creator_id = req.query.creator_id;
  if (!creator_id) return res.status(400).send('Bad Request');

  try {
    const creator = await query('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
    if (creator.rows.length === 0) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    let creator_info = {
      creator_name: creator.rows[0].creator_name,
      username: creator.rows[0].username,
      creator_id: creator.rows[0].creator_id,
      stripe_account_id: creator.rows[0].stripe_account_id,
    };

    res.status(200).json({ creator: creator_info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while getting creator info.' });
  }
}

export { getCreator, onGetCreatorData, onGetCreatorInfoCart };