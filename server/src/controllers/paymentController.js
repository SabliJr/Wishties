import stripe from "../config/payment";
import {
  STRIPES_CLIENT_ID,
  STRIPES_REDIRECT_URI,
  REFRESH_TOKEN_SECRET,
  SERVER_URL,
  CLIENT_URL,
} from "../constants/index";
import jwt from "jsonwebtoken";
import { query, pool } from "../db";

// Onboarding route
const onPaymentSetup = async (req, res) => {
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
  try {
    let { rows } = await query("SELECT * FROM creator WHERE creator_id = $1", [
      creator_id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Creator not found" });
    }
    let creator_username = rows[0].username;

    if (req.query.error) {
      const error = req.query.error;
      return res.status(400).json({ error: error.error_description });
    }

    // Check if a Stripe account already exists for the user
    const { rows: stripeRows } = await query(
      "SELECT * FROM stripe_account WHERE creator_id = $1",
      [creator_id]
    );
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

      const accountResponse = await getAccount(stripeAccountId);
      if (accountResponse.error) {
        return res.status(400).json({ error: accountResponse.error });
      }

      if (
        accountResponse.is_charges_enabled &&
        accountResponse.is_payout_enabled
      ) {
        const client = await pool.connect();
        await client.query(
          "UPDATE creator SET stripe_account_id = $1, is_stripe_connected = $2 WHERE creator_id = $3",
          [stripeAccountId, "ACTIVE", creator_id]
        );
      }

      // Create a new account link for the existing account
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${SERVER_URL}/reauth`,
        return_url: `${CLIENT_URL}/edit-profile/${creator_username}`,
        type: "account_onboarding",
      });

      res.json({ URL: accountLink.url });
    } else {
      // No Stripe account exists for the user, so create a new one

      const account = await stripe.accounts.create({
        type: "express",
        email: req.body.email,
        country: req.body.country,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        business_profile: {
          url: "https://www.wishties.com",
        },
        individual: {
          email: req.body.email,
          phone: req.body.phone,
        },
      });

      // Store account ID in your database
      const accountId = account.id;

      const accountResponse = await getAccount(accountId);
      if (accountResponse.error) {
        return res.status(400).json({ error: accountResponse.error });
      }

      let stripe_email = accountResponse.email;
      let business_profile = accountResponse.business_profile;
      let capabilities = accountResponse.capabilities;
      let country = accountResponse.country;
      let time_created = accountResponse.created;
      let default_currency = accountResponse.default_currency;

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        if (
          accountResponse.is_charges_enabled &&
          accountResponse.is_payout_enabled
        ) {
          await client.query(
            "UPDATE creator SET stripe_account_id = $1, is_stripe_connected = $2 WHERE creator_id = $3",
            [accountId, "ACTIVE", creator_id]
          );
        } else {
          await client.query(
            "UPDATE creator SET stripe_account_id = $1, is_stripe_connected = $2 WHERE creator_id = $3",
            [accountId, "INACTIVE", creator_id]
          );
        }
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
        return_url: `${CLIENT_URL}/edit-profile/${creator_username}`,
        type: "account_onboarding",
      });

      res.json({ URL: accountLink.url });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

// This function is used to get the account details from the stripe API
const getAccount = async (connectedAccountId) => {
  try {
    const response = await stripe.accounts.retrieve(connectedAccountId);
    console.log(`response.charges_enables: ${response.charges_enabled}`);
    console.log(`response.payouts_enabled: ${response.payouts_enabled}`);

    return {
      id: response.id,
      email: response.email,
      business_profile: response.business_profile,
      capabilities: response.capabilities,
      country: response.country,
      created: response.created,
      default_currency: response.default_currency,
      is_payout_enabled: response.payouts_enabled,
      is_charges_enabled: response.charges_enabled,
    };
  } catch (error) {
    return { error: error.message };
  }
};

// Refresh route
const onPaymentSetupRefresh = async (req, res) => {
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
  try {
    let { rows } = await query("SELECT * FROM creator WHERE creator_id = $1", [
      creator_id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Creator not found" });
    }
    let creator_username = rows[0].username;

    const { rows: stripeRows } = await query(
      "SELECT * FROM stripe_account WHERE creator_id = $1",
      [creator_id]
    );
    if (stripeRows.length === 0) {
      return res.status(404).json({ error: "Stripe account not found" });
    }
    let stripeAccountId = stripeRows[0].stripe_account_id;

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${SERVER_URL}/reauth`,
      return_url: `${CLIENT_URL}/edit-profile/${creator_username}`,
      type: "account_onboarding",
    });

    res.json({ URL: accountLink.url });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

export { onPaymentSetup, onPaymentSetupRefresh };
