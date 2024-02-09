import stripe from "../config/payment";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import {
  STRIPES_CLIENT_ID,
  STRIPES_REDIRECT_URI,
  REFRESH_TOKEN_SECRET,
  CLIENT_URL,
  SERVER_URL,
} from "../constants/index";

const onStripeConnectInit = (req, res) => {
  let cookies = req.cookies;
  if (!cookies.refreshToken) return res.status(401).send("unauthorized");

  let payload;
  let refreshToken = cookies.refreshToken;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
  let { creator_id } = payload;

  const queryData = new URLSearchParams({
    response_type: "code",
    client_id: STRIPES_CLIENT_ID,
    scope: "read_write",
    redirect_uri: STRIPES_REDIRECT_URI,
    state: creator_id,
  });
  const connectUri =
    "https://connect.stripe.com/oauth/authorize?" + queryData.toString();

  if (req.query.error) {
    const error = req.query.error;
    return res.status(400).json({ error: error.error_description });
  }

  res.json({
    URL: connectUri,
  });
};

const onPaymentSetup = async (req, res, next) => {
  // Generate a random string as `state` to protect from CSRF and include it in the session
  const creator_id = req.query.state;

  try {
    if (req.query.error) {
      const error = req.query.error;
      return res.status(400).json({ error: error.error_description });
    }

    const tokenResponse = await getToken(req.query.code);
    if (tokenResponse.error) {
      return res.status(400).json({ error: tokenResponse.error });
    }

    let accountId = tokenResponse.stripe_user_id;

    // Create a Stripe account for this user if one does not exist already
    if (accountId == undefined) {
      // Define the parameters to create a new Stripe account with
      let accountParams = {
        type: "express",
        country: req.user.country || undefined,
        email: req.user.email || undefined,
        business_type: req.user.type || "individual",
      };

      // Companies and invididuals require different parameters
      if (accountParams.business_type === "company") {
        accountParams = Object.assign(accountParams, {
          company: {
            name: req.user.businessName || undefined,
          },
        });
      } else {
        accountParams = Object.assign(accountParams, {
          individual: {
            first_name: req.user.firstName || undefined,
            last_name: req.user.lastName || undefined,
            email: req.user.email || undefined,
          },
        });
      }

      const account = await stripe.accounts.create(accountParams);
      if (account.error) {
        console.log("Failed to create a Stripe account.");
        return res.status(400).json({ error: account.error });
      }
      accountId = account.id;

      // Update the model and store the Stripe account ID in the datastore:
      // this Stripe account ID will be used to issue payouts to the pilot
      req.user.stripeAccountId = accountId;
      await req.user.save();
    }

    const accountResponse = await getAccount(accountId);
    if (accountResponse.error) {
      return res.status(400).json({ error: accountResponse.error });
    }

    let stripe_user_id = accountResponse.id;
    let stripe_email = accountResponse.email;
    let business_profile = accountResponse.business_profile;
    let capabilities = accountResponse.capabilities;
    let country = accountResponse.country;
    let time_created = accountResponse.created;
    let default_currency = accountResponse.default_currency;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "UPDATE creator SET stripe_account_id = $1, is_stripe_connected = $2 WHERE creator_id = $3",
        [accountId, "ACTIVE", creator_id]
      );
      const { rows } = await client.query(
        "SELECT * FROM stripe_account WHERE creator_id = $1",
        [creator_id]
      );
      if (rows.length === 0) {
        await client.query(
          "INSERT INTO stripe_account (stripe_account_id, creator_id, stripe_user_id, email, business_profile, capabilities, country, created, default_currency) VALUES($1, $2, $3, $4, $5, $6, $7, to_timestamp($8), $9)",
          [
            accountId,
            creator_id,
            stripe_user_id,
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

    // Create an account link for the user's Stripe account
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: SERVER_URL + "/stripe/authorize",
      return_url: SERVER_URL + "/stripe/onboarded",
      type: "account_onboarding",
    });

    // Redirect to Stripe to start the Express onboarding flow
    res.redirect(accountLink.url);
  } catch (err) {
    console.log("Failed to create a Stripe account.");
    console.log(err);
    next(err);
  }
};

// This function is used to get the token that generated during account creation from the stripe API
const getToken = async (code) => {
  try {
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });
    return { stripe_user_id: response.stripe_user_id };
  } catch (error) {
    return { error: error.message };
  }
};

// This function is used to get the account details from the stripe API
const getAccount = async (accountId) => {
  try {
    const response = await stripe.accounts.retrieve(accountId);
    return {
      id: response.id,
      email: response.email,
      business_profile: response.business_profile,
      capabilities: response.capabilities,
      country: response.country,
      created: response.created,
      default_currency: response.default_currency,
    };
  } catch (error) {
    return { error: error.message };
  }
};

// This function is to create a customer to do subscription,
// which the person who is subscripting to pay the creator, AKA Simp;
const onCreateCustomer = async (email, accountId) => {
  try {
    const customer = await stripe.customers.create(
      {
        email: email,
      },
      {
        stripeAccount: accountId,
      }
    );

    return { id: customer.id };
  } catch (error) {
    return { error: error.message };
  }
};

// This is to do the subscription functionality;
// What are the priceId and AccountId?
const onCreateSubscription = async (customerId, priceId, accountId) => {
  try {
    const subscription = await stripe.subscriptions.create(
      {
        customer: customerId,
        items: [{ price: priceId }],
        expand: ["latest_invoice.payment_intent"],
      },
      {
        stripeAccount: accountId,
      }
    );

    return { id: subscription.id };
  } catch (error) {
    console.error(
      `Failed to create subscription for customer ${customerId} on account ${accountId}: ${error.message}`
    );
    // You might want to send an email to your support team, log the error to an error tracking service, etc.
    return { error: error.message };
  }
};

export { onPaymentSetup, onStripeConnectInit };
