import { Request, Response } from 'express';

const onAddSocialLinks = (req: Request, res: Response) => {
  // const { youtube, facebook, instagram, twitter, tiktok } = req.body;
  console.log(req.body);
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
        return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    // console.log(refreshToken);
    // Verify the user's refresh token and get the user's username and email before sending the wish to the database;
    let username = '';
    try {
        // const { rows } = await query(insertWishQuery, [wish_name, wish_price, wish_category]);
        // const createdWish = rows[0];
        res.status(201).json({ message: 'Wish added successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the wish.' });
    }
}

export { onAddSocialLinks };