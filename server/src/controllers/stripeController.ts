import { Request, Response } from 'express';
import stripe from '../config/payment';
import { REFRESH_TOKEN_SECRET, SERVER_URL, CLIENT_URL } from '../constants/index';
import jwt from 'jsonwebtoken';
import { query, pool } from '../db';


interface DecodedToken {
  username: string;
  creator_name: string;
  creator_id: string;
  [key: string]: any; // for any other properties that might be in the token
}

interface TokenResponse {
  stripe_user_id?: string;
  error?: string;
}

interface AccountResponse {
  id?: string;
  email?: string;
  business_profile?: any;
  capabilities?: any;
  country?: string;
  created?: number;
  default_currency?: string;
  error?: string | undefined;
  is_charges_enabled?: boolean;
  is_payout_enabled?: boolean;
}

// Onboarding route
const onPaymentSetup = async (req: Request, res: Response) => {
  let cookies = req.cookies;
  if (!cookies.refreshToken)
    return res.status(401).send('unauthorized');

  let payload;
  let refreshToken = cookies.refreshToken;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }

  let { creator_id } = payload;
  try {
    let { rows } = await query('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    let creator_username = rows[0].username;

    if (req.query.error) {
    const error = req.query.error as { [key: string]: unknown };
      return res.status(400).json({ error: error.error_description });
    }

    // Check if a Stripe account already exists for the user
    const { rows: stripeRows } = await query('SELECT * FROM stripe_account WHERE creator_id = $1', [creator_id]);
    if (stripeRows.length > 0) {
      let stripeAccountId = stripeRows[0].stripe_account_id;

      // Update the Stripe account with the new information
      await stripe.accounts.update(stripeAccountId, {
        email: req.body.email,
        individual: {
          email: req.body.email,
          phone: req.body.phone,
        },
        // Here to add any other fields that might have changed
      });

      // Create a new account link for the existing account
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${SERVER_URL}/reauth`,
        return_url: `${SERVER_URL}/stripe/return?creator_id=${creator_id}`,
        type: 'account_onboarding',
      });

      res.json({ URL: accountLink.url });
    } else {
      // No Stripe account exists for the user, so create a new one
      const account = await stripe.accounts.create({
        type: 'express',
        email: req.body.email,
        country: req.body.country,
        capabilities: {
          card_payments: {requested: true},
          transfers: {requested: true},
        },
          business_type: 'individual',
        business_profile: {
          url: 'https://www.wishties.com',
        },
        individual: {
          email: req.body.email,
          phone: req.body.phone,
        },
      });
    
      // Store account ID in your database
      const accountId = account.id;

      const accountResponse = await getAccount(accountId as string) as AccountResponse; 
      if (accountResponse.error) {
        return res.status(400).json({ error: accountResponse.error });
      }

      let stripe_email = accountResponse.email;
      let business_profile = accountResponse.business_profile
      let capabilities = accountResponse.capabilities
      let country = accountResponse.country
      let time_created = accountResponse.created
      let default_currency = accountResponse.default_currency

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
         await client.query(
            "UPDATE creator SET stripe_account_id = $1 WHERE creator_id = $2",
            [accountId, creator_id]
          );

        const { rows } = await client.query(
          "SELECT * FROM stripe_account WHERE creator_id = $1",
          [creator_id]
        );
        if (rows.length === 0) {
          await client.query(
            "INSERT INTO stripe_account (stripe_account_id, creator_id, email, business_profile, capabilities, country, created, default_currency) VALUES($1, $2, $3, $4, $5, $6, to_timestamp($7), $8)",
            [
              accountId,
              creator_id,
              stripe_email,
              business_profile,
              capabilities,
              country,
              time_created,
              default_currency,
            ]
          );
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${SERVER_URL}/reauth`,
        // return_url: `${CLIENT_URL}/edit-profile/${creator_username}`,
        return_url: `${SERVER_URL}/stripe/return?creator_id=${creator_id}`,
        type: 'account_onboarding',
      });
    
      res.json({ URL: accountLink.url });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

// This function is used to get the account details from the stripe API
const getAccount = async (connectedAccountId: string): Promise<AccountResponse> => {
  try {
    const response = await stripe.accounts.retrieve(connectedAccountId);

    return {
      id: response.id,
      email: response.email as string,
      business_profile: response.business_profile,
      capabilities: response.capabilities,
      country: response.country,
      created: response.created,
      default_currency: response.default_currency,
      is_charges_enabled: response.charges_enabled,
      is_payout_enabled: response.payouts_enabled,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Catch the return URL from Stripe
const onStripeReturn = async (req: Request, res: Response) => {
  const { creator_id } = req.query;
  console.log('creator_id: ', creator_id);

  try {
    const { rows } = await query('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    let creator_stripe_account_id = rows[0].stripe_account_id;
    console.log('creator_stripe_account_id: ', creator_stripe_account_id);
    const accountResponse = await getAccount(creator_stripe_account_id as string) as AccountResponse; 
    if (accountResponse.error) {
      return res.status(400).json({ error: accountResponse.error });
    }

    console.log(`accountResponse.is_charges_enabled: ${accountResponse.is_charges_enabled}`);
    console.log(`accountResponse.is_payout_enabled: ${accountResponse.is_payout_enabled}`);

    const client = await pool.connect();
    if (
      accountResponse.is_charges_enabled &&
      accountResponse.is_payout_enabled
    ) {
      console.log('we are in the if statement');
      await client.query(
        "UPDATE creator SET is_stripe_connected = $1 WHERE creator_id = $2",
        ["ACTIVE", creator_id]
      );
    } 

    res.redirect(`${CLIENT_URL}/edit-profile/${rows[0].username}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }

}

// Refresh route
const onPaymentSetupRefresh = async (req: Request, res: Response) => {
  let cookies = req.cookies;
  if (!cookies.refreshToken)
    return res.status(401).send('unauthorized');

  let payload;
  let refreshToken = cookies.refreshToken;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }

  let { creator_id } = payload;
  try {
    let { rows } = await query('SELECT * FROM creator WHERE creator_id = $1', [creator_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    let creator_username = rows[0].username;

    const { rows: stripeRows } = await query('SELECT * FROM stripe_account WHERE creator_id = $1', [creator_id]);
    if (stripeRows.length === 0) {
      return res.status(404).json({ error: 'Stripe account not found' });
    }
    let stripeAccountId = stripeRows[0].stripe_account_id;

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${SERVER_URL}/reauth`,
      return_url: `${CLIENT_URL}/edit-profile/${creator_username}`,
      type: 'account_onboarding',
    });

    res.json({ URL: accountLink.url });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

const onFanPurchase = async (req: Request, res: Response) => {
  const { stripeAccountId } = req.body;

  const session = await stripe.checkout.sessions?.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Fan Purchase',
        },
        unit_amount: 2000, // 20.00 USD
      },
      quantity: 1,
    }],
    payment_intent_data: {
      application_fee_amount: 200, // 2.00 USD
      transfer_data: {
        destination: stripeAccountId,
      },
    },
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.json({ id: session.id });
}

export { onPaymentSetup, onPaymentSetupRefresh, onStripeReturn, onFanPurchase };