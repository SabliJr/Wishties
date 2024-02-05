import { Request, Response } from 'express';
import stripe from '../config/payment';
import { STRIPES_CLIENT_ID, STRIPES_REDIRECT_URI, REFRESH_TOKEN_SECRET } from '../constants/index';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

interface TokenResponse {
  stripe_user_id?: string;
  error?: string;
}

interface AccountResponse {
  // Define the properties of the account response here
  error?: string | undefined;
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
}

interface CustomerCreationResponse {
  id?: string;
  error?: string;
}

interface SubscriptionCreationResponse {
  id?: string;
  error?: string;
}

interface DecodedToken {
  username: string;
  creator_name: string;
  creator_id: string;
  [key: string]: any; // for any other properties that might be in the token
}

// This function is used to initialize the stripe connect
const onStripeConnectInit = (req: Request, res: Response) => {
  const queryData = new URLSearchParams({
    response_type: 'code',
    client_id: STRIPES_CLIENT_ID as string,
    scope: 'read_write',
    redirect_uri: STRIPES_REDIRECT_URI as string,
  });
  const connectUri = 'https://connect.stripe.com/oauth/authorize?' + queryData.toString();

  if (req.query.error) {
    const error = req.query.error as { [key: string]: unknown };
    return res.status(400).json({ error: error.error_description });
  }

  res.json({
    URL: connectUri
  });
}

// This function is used to redirect the user to the stripe connect page
const onConnectRedirect = async (req: Request, res: Response) => {
  try {
    let cookies = req.cookies;
    if (!cookies.refreshToken)
      return res.status(401).send('unauthorized');

    let refreshToken = cookies.refreshToken;
    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
    } catch (err) {
      return res.status(401).send('Unauthorized');
    }
    let { creator_id } = payload;
    
    if (req.query.error) {
      const error = req.query.error as { [key: string]: unknown };
      return res.status(400).json({ error: error.error_description });
    }

    const tokenResponse = await getToken(req.query.code as string) as TokenResponse;
    if (tokenResponse.error) {
      return res.status(400).json({ error: tokenResponse.error });
    }

    const connectedAccountId = tokenResponse.stripe_user_id;
    const accountResponse = await getAccount(connectedAccountId as string) as AccountResponse; 
    if (accountResponse.error) {
      return res.status(400).json({ error: accountResponse.error });
    }

    let stripe_user_id = accountResponse.id
    let stripe_email = accountResponse.email
    let business_profile = accountResponse.business_profile
    let capabilities = accountResponse.capabilities
    let country = accountResponse.country
    let time_created = accountResponse.created
    let default_currency = accountResponse.default_currency

     const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE creator SET stripe_account_id = $1, is_stripe_connected = $2 WHERE creator_id = $3', [connectedAccountId, 'ACTIVE', creator_id]);
      const { rows } = await client.query('SELECT * FROM stripe_account WHERE creator_id = $1', [creator_id]);
      if (rows.length === 0) {
        await client.query('INSERT INTO stripe_account ( creator_id, stripe_user_id, email, business_profile, capabilities, country, created, default_currency) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [
          creator_id, stripe_user_id, stripe_email, business_profile, capabilities, country, time_created, default_currency
        ]);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    res.json({ account: accountResponse });
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).send('An error occurred');
  }
}

// This function is used to get the token that generated during account creation from the stripe API
const getToken = async (code: string): Promise<TokenResponse> => {
  try {
    const response = await stripe.oauth.token({ grant_type: 'authorization_code', code });
    return { stripe_user_id: response.stripe_user_id };
  } catch (error) {
    return { error: (error as Error).message};
  }
}

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
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// This function is to create a customer to do subscription, 
// which the person who is subscripting to pay the creator, AKA Simp;
const onCreateCustomer = async (email: string, accountId: string): Promise<CustomerCreationResponse> => {
  try {
    const customer = await stripe.customers.create({
      email: email,
    }, {
      stripeAccount: accountId,
    });

    return { id: customer.id };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// This is to do the subscription functionality;
// What are the priceId and AccountId?
const onCreateSubscription = async (customerId: string, priceId: string, accountId: string): Promise<SubscriptionCreationResponse> => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    }, {
      stripeAccount: accountId,
    });

    return { id: subscription.id };
  } catch (error) {
    console.error(`Failed to create subscription for customer ${customerId} on account ${accountId}: ${(error as Error).message}`);
    // You might want to send an email to your support team, log the error to an error tracking service, etc.
    return { error: (error as Error).message };
  }
}

export {
	onStripeConnectInit,
  onConnectRedirect,
  onCreateCustomer,
  onCreateSubscription
}