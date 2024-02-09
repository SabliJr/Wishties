import { Request, Response } from 'express';
import stripe from '../config/payment';
import { STRIPES_CLIENT_ID, STRIPES_REDIRECT_URI, REFRESH_TOKEN_SECRET, SERVER_URL, CLIENT_URL } from '../constants/index';
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
}

// This function is used to initialize the stripe connect
const onStripeConnectInit = (req: Request, res: Response) => {
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
  
  const queryData = new URLSearchParams({
    response_type: 'code',
    client_id: STRIPES_CLIENT_ID as string,
    scope: 'read_write',
    redirect_uri: STRIPES_REDIRECT_URI as string,
    state: creator_id,
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
        refresh_url: window.location.href,
        return_url: `${CLIENT_URL}/edit-profile/${creator_username}`,
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
      console.log(`accountResponse: ${accountResponse}`);
      if (accountResponse.error) {
        return res.status(400).json({ error: accountResponse.error });
      }

      let stripe_user_id = accountResponse.id
      let stripe_email = accountResponse.email;
      let business_profile = accountResponse.business_profile
      let capabilities = accountResponse.capabilities
      let country = accountResponse.country
      let time_created = accountResponse.created
      let default_currency = accountResponse.default_currency

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('UPDATE creator SET stripe_account_id = $1, is_stripe_connected = $2 WHERE creator_id = $3', [accountId, 'ACTIVE', creator_id]);
        const { rows } = await client.query('SELECT * FROM stripe_account WHERE creator_id = $1', [creator_id]);
        if (rows.length === 0) {
          await client.query('INSERT INTO stripe_account (stripe_account_id, creator_id, stripe_user_id, email, business_profile, capabilities, country, created, default_currency) VALUES($1, $2, $3, $4, $5, $6, $7, to_timestamp($8), $9)', [
          accountId, creator_id, stripe_user_id, stripe_email, business_profile, capabilities, country, time_created, default_currency
          ]);
        }
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${SERVER_URL}/reauth`,
        return_url: `${CLIENT_URL}/edit-profile/${creator_username}`,
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
    console.log(`response.id: ${response.id}`);
    console.log(`response.email: ${response.email}`);
    console.log(`response.business_profile: ${response.business_profile}`);
    console.log(`response.capabilities: ${response.capabilities}`);
    console.log(`response.country: ${response.country}`);
    console.log(`response.created: ${response.created}`);
    console.log(`response.default_currency: ${response.default_currency}`);
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

export { onPaymentSetup, onStripeConnectInit, onPaymentSetupRefresh };



// import { Request, Response, NextFunction } from 'express';
// import stripe from '../config/payment';
// import { STRIPES_CLIENT_ID, STRIPES_REDIRECT_URI, REFRESH_TOKEN_SECRET, CLIENT_URL } from '../constants/index';
// import jwt from 'jsonwebtoken';
// import { pool } from '../db';


    // const tokenResponse = await getToken(req.query.code as string) as TokenResponse;
    // if (tokenResponse.error) {
    //   return res.status(400).json({ error: tokenResponse.error });
    // }

// interface AccountResponse {
//   // Define the properties of the account response here
//   error?: string | undefined;
//   id?: string;
// }



// interface RequestWithUser extends Request {
//   user?: User;
// }

// interface User {
//   country?: string;
//   email?: string;
//   type?: string;
//   businessName?: string;
//   firstName?: string;
//   lastName?: string;
//   stripeAccountId?: string;
//   save: () => Promise<void>;
//   // Add any other properties you need
// }

// interface AccountResponse {
//   id?: string;
//   email?: string;
//   business_profile?: any;
//   capabilities?: any;
//   country?: string;
//   created?: number;
//   default_currency?: string;
//   error?: string | undefined;
// }

// interface AccountCreateParams {
//   type: 'standard' | 'express' | 'custom';
//   country?: string;
//   email?: string;
//   business_type?: 'individual' | 'company';
//   individual?: {
//     first_name?: string;
//     last_name?: string;
//     email?: string;
//     // Other individual account details...
//   };
//   company?: {
//     name?: string;
//     // Other company account details...
//   };
//   // Other account details...
// }





// // This function is used to redirect the user to the stripe connect page
// const onConnectRedirect = async (req: RequestWithUser, res: Response, next: NextFunction) => {
//   const creator_id = req.query.state as string;

//   try {
//     if (req.query.error) {
//       const error = req.query.error as { [key: string]: unknown };
//       return res.status(400).json({ error: error.error_description });
//     }

//     const tokenResponse = await getToken(req.query.code as string) as TokenResponse;
//     if (tokenResponse.error) {
//       return res.status(400).json({ error: tokenResponse.error });
//     }

//     let connectedAccountId = tokenResponse.stripe_user_id;
//     // If the user doesn't have a connected Stripe account, create one
//     // Create a Stripe account for this user if one does not exist already
//     if (!connectedAccountId) {
//       // Define the parameters to create a new Stripe account with
//       let accountParams: AccountCreateParams = {
//         type: 'express',
//         country: req.user?.country || undefined,
//         email: req.user?.email || undefined,
//         business_type: req.user?.type as 'individual' | 'company' || 'individual',
//       };
      
//       // Companies and individuals require different parameters
//       if (accountParams.business_type === 'company') {
//         accountParams = {
//           ...accountParams,
//           company: {
//             name: req.user?.businessName || undefined,
//           },
//         };
//       } else {
//         accountParams = {
//           ...accountParams,
//           individual: {
//             first_name: req.user?.firstName || undefined,
//             last_name: req.user?.lastName || undefined,
//             email: req.user?.email || undefined,
//           },
//         };
//       }

//       const account = await stripe.accounts.create(accountParams);
//       connectedAccountId = account.id;

//       // Update the model and store the Stripe account ID in the datastore:
//       // this Stripe account ID will be used to issue payouts to the pilot
//       if (req.user) {
//         req.user.stripeAccountId = connectedAccountId;
//         await req.user.save();
//       }
//     }

//     const accountResponse = await getAccount(connectedAccountId as string) as AccountResponse; 
//     if (accountResponse.error) {
//       return res.status(400).json({ error: accountResponse.error });
//     }

//     // Create an account link for the user's Stripe account
//     const accountLink = await stripe.accountLinks.create({
//       account: connectedAccountId as string,
//       refresh_url: CLIENT_URL + '/pilots/stripe/authorize',
//       return_url: CLIENT_URL + '/pilots/stripe/onboarded',
//       type: 'account_onboarding'
//     });

//     // Redirect to Stripe to start the Express onboarding flow
//     res.redirect(accountLink.url);
//   } catch (error) {
//     console.error((error as Error).message);
//     next(error);
//   }
// }

// // This function is used to get the token that generated during account creation from the stripe API
// const getToken = async (code: string): Promise<TokenResponse> => {
//   try {
//     const response = await stripe.oauth.token({ grant_type: 'authorization_code', code });
//     return { stripe_user_id: response.stripe_user_id };
//   } catch (error) {
//     return { error: (error as Error).message};
//   }
// }

// // This function is used to get the account details from the stripe API
// const getAccount = async (connectedAccountId: string): Promise<AccountResponse> => {
//   try {
//     const response = await stripe.accounts.retrieve(connectedAccountId);
//     return {
//       id: response.id,
//       email: response.email as string,
//       business_profile: response.business_profile,
//       capabilities: response.capabilities,
//       country: response.country,
//       created: response.created,
//       default_currency: response.default_currency,
//     };
//   } catch (error) {
//     return { error: (error as Error).message };
//   }
// }

// import { Request, Response, NextFunction } from 'express';
// import stripe from '../config/payment';
// import { STRIPES_CLIENT_ID, STRIPES_REDIRECT_URI, REFRESH_TOKEN_SECRET, CLIENT_URL, SERVER_URL } from '../constants/index';
// import jwt from 'jsonwebtoken';
// import { pool } from '../db';
// // import Stripe from 'stripe';

// // const stripeInstance = new Stripe(STRIPES_SECRET_KEY as string); // Initialize Stripe with your secret key

// interface TokenResponse {
//   stripe_user_id?: string;
//   error?: string;
// }

// interface AccountResponse {
//   // Define the properties of the account response here
//   error?: string | undefined;
// }

// interface AccountResponse {
//   id?: string;
//   email?: string;
//   business_profile?: any;
//   capabilities?: any;
//   country?: string;
//   created?: number;
//   default_currency?: string;
//   error?: string | undefined;
// }

// interface CustomerCreationResponse {
//   id?: string;
//   error?: string;
// }

// interface SubscriptionCreationResponse {
//   id?: string;
//   error?: string;
// }

// interface DecodedToken {
//   username: string;
//   creator_name: string;
//   creator_id: string;
//   [key: string]: any; // for any other properties that might be in the token
// }

// interface AccountResponse {
//   country?: string;
//   email?: string;
//   type?: string;
//   businessName?: string;
//   firstName?: string;
//   lastName?: string;
//    stripeAccountId?: string;
//   save: () => Promise<void>;
//   // Add any other properties you need
// }

// // interface RequestWithUser extends Request {
// //   user?: User;
// // }

// // interface AccountCreateParams {
// //   type: 'standard' | 'express' | 'custom';
// //   country?: string;
// //   email?: string;
// //   business_type?: 'individual' | 'company';
// //   individual?: {
// //     first_name?: string;
// //     last_name?: string;
// //     email?: string;
// //     // Other individual account details...
// //   };
// //   company?: {
// //     name?: string;
// //     // Other company account details...
// //   };
// //   // Other account details...
// // }

// interface User {
//   country?: string;
//   email?: string;
//   type?: string;
//   businessName?: string;
//   firstName?: string;
//   lastName?: string;
//   stripeAccountId?: string;
//   save: () => Promise<void>;
//   // Add any other properties you need
// }

// // Then define the AccountCreateParams type using the User interface
// interface AccountCreateParams {
//   type: 'standard' | 'express' | 'custom';
//   country?: string;
//   email?: string;
//   business_type?: User['type']; // This will be either 'individual' or 'company'
//   individual?: {
//     first_name?: string;
//     last_name?: string;
//     email?: string;
//     // Other individual account details...
//   };
//   company?: {
//     name?: string;
//     // Other company account details...
//   };
//   // Other account details...
// }

// // This function is used to initialize the stripe connect
// const onStripeConnectInit = (req: Request, res: Response) => {
//   let cookies = req.cookies;
//   if (!cookies.refreshToken)
//     return res.status(401).send('unauthorized');

//   let payload;
//   let refreshToken = cookies.refreshToken;  
//   try {
//     payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as DecodedToken;
//   } catch (err) {
//     return res.status(401).send('Unauthorized');
//   }
//   let { creator_id } = payload;
  
//   const queryData = new URLSearchParams({
//     response_type: 'code',
//     client_id: STRIPES_CLIENT_ID as string,
//     scope: 'read_write',
//     redirect_uri: STRIPES_REDIRECT_URI as string,
//     state: creator_id,
//   });
//   const connectUri = 'https://connect.stripe.com/oauth/authorize?' + queryData.toString();

//   if (req.query.error) {
//     const error = req.query.error as { [key: string]: unknown };
//     return res.status(400).json({ error: error.error_description });
//   }

//   res.json({
//     URL: connectUri
//   });
// }

// // This function is used to redirect the user to the stripe connect page
// const onConnectRedirect = async (req: Request, res: Response, next: NextFunction) => {
//   const creator_id = req.query.state as string;

//   try {
//     if (req.query.error) {
//       const error = req.query.error as { [key: string]: unknown };
//       return res.status(400).json({ error: error.error_description });
//     }

//     const tokenResponse = await getToken(req.query.code as string) as TokenResponse;
//     if (tokenResponse.error) {
//       return res.status(400).json({ error: tokenResponse.error });
//     }

//     let connectedAccountId = tokenResponse.stripe_user_id;
//     // If the user doesn't have a connected Stripe account, create one
//     // Create a Stripe account for this user if one does not exist already
//     if (!connectedAccountId) {
//       // Define the parameters to create a new Stripe account with
//     let accountParams: AccountCreateParams = {
//       type: 'express',
//       country: req.user?.country || undefined,
//       email: req.user?.email || undefined,
//       business_type: req.user?.type as 'individual' | 'company' || 'individual',
//     };
  
//       // Companies and invididuals require different parameters
//     if (accountParams.business_type === 'company') {
//   accountParams = {
//     ...accountParams,
//     company: {
//       name: req.user?.businessName || undefined,
//     },
//   };
// } else {
//   accountParams = {
//     ...accountParams,
//     individual: {
//       first_name: req.user?.firstName || undefined,
//       last_name: req.user?.lastName || undefined,
//       email: req.user?.email || undefined,
//     },
//   };
//       };

//       // const account = await stripeInstance.accounts.create({
//       //   type: 'express',
//       //   // Add any other account details you need here
//       // });

//       const account = await stripe.accounts.create(accountParams);
//       let connectedAccountId = account.id;

//       // Update the model and store the Stripe account ID in the datastore:
//       // this Stripe account ID will be used to issue payouts to the pilot
//       if (req.user) {
//         req.user.stripeAccountId = connectedAccountId;
//         await req.user.save();
//       }

//       connectedAccountId = account.id;
//     }

//     // const connectedAccountId = tokenResponse.stripe_user_id;
//     const accountResponse = await getAccount(connectedAccountId as string) as AccountResponse; 
//     if (accountResponse.error) {
//       return res.status(400).json({ error: accountResponse.error });
//     }

//     let stripe_user_id = accountResponse.id
//     let stripe_email = accountResponse.email
//     let business_profile = accountResponse.business_profile
//     let capabilities = accountResponse.capabilities
//     let country = accountResponse.country
//     let time_created = accountResponse.created
//     let default_currency = accountResponse.default_currency

//     const client = await pool.connect();
//     try {
//       await client.query('BEGIN');
//       await client.query('UPDATE creator SET stripe_account_id = $1, is_stripe_connected = $2 WHERE creator_id = $3', [connectedAccountId, 'ACTIVE', creator_id]);
//       const { rows } = await client.query('SELECT * FROM stripe_account WHERE creator_id = $1', [creator_id]);
//       if (rows.length === 0) {
//         await client.query('INSERT INTO stripe_account (stripe_account_id, creator_id, stripe_user_id, email, business_profile, capabilities, country, created, default_currency) VALUES($1, $2, $3, $4, $5, $6, $7, to_timestamp($8), $9)', [
//          connectedAccountId, creator_id, stripe_user_id, stripe_email, business_profile, capabilities, country, time_created, default_currency
//         ]);
//       }
//       await client.query('COMMIT');
//     } catch (error) {
//       await client.query('ROLLBACK');
//       throw error;
//     } finally {
//       client.release();
//     }

//     // res.json({ account: accountResponse });
//     // res.redirect('http://localhost:3000/creator-dashboard');
      
//       // Create an account link for the user's Stripe account
//     const accountLink = await stripe.accountLinks.create({
//       account: connectedAccountId as string,
//       refresh_url: CLIENT_URL + '/pilots/stripe/authorize',
//       return_url: CLIENT_URL + '/pilots/stripe/onboarded',
//       type: 'account_onboarding'
//     });

//     // Redirect to Stripe to start the Express onboarding flow
//     res.redirect(accountLink.url);
//   } catch (error) {
//     console.error((error as Error).message);
//     // res.status(500).send('An error occurred');
//     next(error);
//   }
// }

// // This function is used to get the token that generated during account creation from the stripe API
// const getToken = async (code: string): Promise<TokenResponse> => {
//   try {
//     const response = await stripe.oauth.token({ grant_type: 'authorization_code', code });
//     return { stripe_user_id: response.stripe_user_id };
//   } catch (error) {
//     return { error: (error as Error).message};
//   }
// }

// // This function is used to get the account details from the stripe API
// const getAccount = async (connectedAccountId: string): Promise<AccountResponse> => {
//   try {
//     const response = await stripe.accounts.retrieve(connectedAccountId);
//     return {
//       id: response.id,
//       email: response.email as string,
//       business_profile: response.business_profile,
//       capabilities: response.capabilities,
//       country: response.country,
//       created: response.created,
//       default_currency: response.default_currency,
//     };
//   } catch (error) {
//     return { error: (error as Error).message };
//   }
// }

// // This function is to create a customer to do subscription, 
// // which the person who is subscripting to pay the creator, AKA Simp;
// const onCreateCustomer = async (email: string, accountId: string): Promise<CustomerCreationResponse> => {
//   try {
//     const customer = await stripe.customers.create({
//       email: email,
//     }, {
//       stripeAccount: accountId,
//     });

//     return { id: customer.id };
//   } catch (error) {
//     return { error: (error as Error).message };
//   }
// }

// // This is to do the subscription functionality;
// // What are the priceId and AccountId?
// const onCreateSubscription = async (customerId: string, priceId: string, accountId: string): Promise<SubscriptionCreationResponse> => {
//   try {
//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price: priceId }],
//       expand: ['latest_invoice.payment_intent'],
//     }, {
//       stripeAccount: accountId,
//     });

//     return { id: subscription.id };
//   } catch (error) {
//     console.error(`Failed to create subscription for customer ${customerId} on account ${accountId}: ${(error as Error).message}`);
//     // You might want to send an email to your support team, log the error to an error tracking service, etc.
//     return { error: (error as Error).message };
//   }
// }

// export {
//   onStripeConnectInit,
//   onConnectRedirect
// }
