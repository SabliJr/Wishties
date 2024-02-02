import { Request, Response } from 'express';
import { query } from '../db';

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



export { getCreator };