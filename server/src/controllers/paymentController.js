import stripe from "../config/payment";
import {
  REFRESH_TOKEN_SECRET,
  SERVER_URL,
  CLIENT_URL,
  WEBHOOK_SIGNING_SECRET,
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

      // Create a new account link for the existing account
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${SERVER_URL}/reauth`,
        return_url: `${SERVER_URL}/stripe/return?creator_id=${creator_id}`,
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
        return_url: `${SERVER_URL}/stripe/return?creator_id=${creator_id}`,
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

    return {
      id: response.id,
      email: response.email,
      business_profile: response.business_profile,
      capabilities: response.capabilities,
      country: response.country,
      created: response.created,
      default_currency: response.default_currency,
      is_charges_enabled: response.charges_enabled,
      is_payout_enabled: response.payouts_enabled,
    };
  } catch (error) {
    return { error: error.message };
  }
};

// Catch the return URL from Stripe
const onStripeReturn = async (req, res) => {
  const { creator_id } = req.query;

  try {
    const { rows } = await query(
      "SELECT * FROM creator WHERE creator_id = $1",
      [creator_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Creator not found" });
    }

    let creator_stripe_account_id = rows[0].stripe_account_id;
    const accountResponse = await getAccount(creator_stripe_account_id);
    if (accountResponse.error) {
      return res.status(400).json({ error: accountResponse.error });
    }

    const client = await pool.connect();
    if (
      accountResponse.is_charges_enabled &&
      accountResponse.is_payout_enabled
    ) {
      await client.query(
        "UPDATE creator SET is_stripe_connected = $1 WHERE creator_id = $2",
        ["ACTIVE", creator_id]
      );
    }

    res.redirect(`${CLIENT_URL}/edit-profile/${rows[0].username}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
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

const onPurchase = async (req, res) => {
  const { simp_email, message, is_to_publish, cart } = req.body;
  let creator_id = cart[0].creator_id;

  try {
    let { rows } = await query("SELECT * FROM creator WHERE creator_id = $1", [
      creator_id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Creator not found" });
    }
    if (rows[0].is_stripe_connected !== "ACTIVE") {
      return res
        .status(400)
        .json({ error: "Creator is not connected to Stripe" });
    }
    let stripe_account_id = rows[0].stripe_account_id;

    // Adjust the amount that the fan pays and the creator receives
    let totalAmount = cart.reduce((acc, item) => {
      return acc + Number(item.wish_price) * Number(item.quantity);
    }, 0);

    // Calculate the total fee
    const totalFee = Math.round(totalAmount * 0.1);
    const fanAmount = Math.round(totalAmount * 1.1); // Fan pays 10% less
    const creatorAmount = Math.round(totalAmount * 0.9); // Creator receives 10% less

    let lineItems = cart.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Gift donation funds for ${item.wish_name}.`,
            images: [
              "https://paymenticons.s3.us-east-1.amazonaws.com/giftbox.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIQCQwGZBnzu8MQ4W7WvQDHXXXvrX7RxM7cV8gmJS40PERgIgIdbW0ldvJXZIrywxWA92O%2BrxS5TpjaqSdpj%2BivR%2Baikq5AIIfBAAGgwyNjcxODkzMzAzMDUiDArRlSorocYMDnKcjirBAozqGTAQOfwgUfqiDCtQckgKguaLUao9vm9GdwJSTSYEMkPns%2F1SUVqDZDCcT1SSb%2BhTx1Pb4WyjDpZD%2BjLpdGpxrrTj7IGXkVkyYwviFoXMzX90Mn9cLmSggj6QAH5WHs%2FIvw6lw1jOj813qkP9Cf56vP3fPt1yYAS78U3wahX5VimkFmS3mu6RroGidz82sUVF3NAPWJf8jSWBfxkhMSQRkEHfBGJZ7Af0aoBrSa5HGBKXcg0%2FA1Y8fUl8tQ4I%2BmpyXkxzQm2vOv3c0ojTja9IcqT9k0ywPdzFtms%2FpKBHOuERgvnAeb4RQ8uOZ0bpNU3YPd1aajEuLufEzpD52llxcZ7qwUKq0lKj9iZTdHW9Iej5ZCQ1mdysQzQlFo2AqM908Uq0lv5JnznyMHaGux3v4EUhy9YqipoRP%2BYULyBKPjCf566uBjqzAruVgY1iN14im6dSeI%2F%2FAdeP1bjwF5Y2ODEd%2BeGXuNS6cwMyarNnle3ERbS2jpGQRUTlcTpchhVa4Xb%2BFrS5MFGinkb59wi1vUsAaJ%2FMBnB8lCY0BAyeAeQBBnRvxquweHHfrjYx6VG4PNA%2BdubetREmYSLNTGe1dWX8KzqDsIidYEbYvfoAzapU8Hlm4G2wKbX0CZl8M0VKFKyxtj04SfdO%2BtWvu%2BYML18Sw%2BWynv6bl8G5Feh1ncqcEdlBo%2BUshxbEQj6Iz26Y%2F27z3594Fp4KiLmPJS7nC7ePVZH2CcAOlXqKHf31Ji4%2FehevOIcfAXSYYkeh20KrU78mFI3FQrcpc%2F30gNydj1wpuh7ZUuGF3ieFLiSOaqKpAjjpY3SK7S6DMCjd70TE45tY1kaxBWNpHQM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240213T193139Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAT4NNZUGAUFQX4KHM%2F20240213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=21e3ed80b8758a7a601a37c04fc49abe141bea93551781602a4772b60544533d",
            ],
          },
          unit_amount: item.wish_price * 100,
        },
        quantity: item.quantity,
      };
    });

    // Add the fee as a separate line item
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Wishties Fee",
          images: [
            "https://paymenticons.s3.us-east-1.amazonaws.com/fav.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJHMEUCIQCQwGZBnzu8MQ4W7WvQDHXXXvrX7RxM7cV8gmJS40PERgIgIdbW0ldvJXZIrywxWA92O%2BrxS5TpjaqSdpj%2BivR%2Baikq5AIIfBAAGgwyNjcxODkzMzAzMDUiDArRlSorocYMDnKcjirBAozqGTAQOfwgUfqiDCtQckgKguaLUao9vm9GdwJSTSYEMkPns%2F1SUVqDZDCcT1SSb%2BhTx1Pb4WyjDpZD%2BjLpdGpxrrTj7IGXkVkyYwviFoXMzX90Mn9cLmSggj6QAH5WHs%2FIvw6lw1jOj813qkP9Cf56vP3fPt1yYAS78U3wahX5VimkFmS3mu6RroGidz82sUVF3NAPWJf8jSWBfxkhMSQRkEHfBGJZ7Af0aoBrSa5HGBKXcg0%2FA1Y8fUl8tQ4I%2BmpyXkxzQm2vOv3c0ojTja9IcqT9k0ywPdzFtms%2FpKBHOuERgvnAeb4RQ8uOZ0bpNU3YPd1aajEuLufEzpD52llxcZ7qwUKq0lKj9iZTdHW9Iej5ZCQ1mdysQzQlFo2AqM908Uq0lv5JnznyMHaGux3v4EUhy9YqipoRP%2BYULyBKPjCf566uBjqzAruVgY1iN14im6dSeI%2F%2FAdeP1bjwF5Y2ODEd%2BeGXuNS6cwMyarNnle3ERbS2jpGQRUTlcTpchhVa4Xb%2BFrS5MFGinkb59wi1vUsAaJ%2FMBnB8lCY0BAyeAeQBBnRvxquweHHfrjYx6VG4PNA%2BdubetREmYSLNTGe1dWX8KzqDsIidYEbYvfoAzapU8Hlm4G2wKbX0CZl8M0VKFKyxtj04SfdO%2BtWvu%2BYML18Sw%2BWynv6bl8G5Feh1ncqcEdlBo%2BUshxbEQj6Iz26Y%2F27z3594Fp4KiLmPJS7nC7ePVZH2CcAOlXqKHf31Ji4%2FehevOIcfAXSYYkeh20KrU78mFI3FQrcpc%2F30gNydj1wpuh7ZUuGF3ieFLiSOaqKpAjjpY3SK7S6DMCjd70TE45tY1kaxBWNpHQM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240213T193105Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAT4NNZUGAUFQX4KHM%2F20240213%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5981ef3327cfa5a96924a004524819017a2e28a699d97a8fdaa265673e9133a6",
          ],
        },
        unit_amount: totalFee * 100, // Convert to cents
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions?.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      payment_intent_data: {
        application_fee_amount: (fanAmount - creatorAmount) * 100, // This is the total application fee
        transfer_data: {
          destination: stripe_account_id,
        },
      },
      mode: "payment",
      success_url: `${CLIENT_URL}/payment/success`,
      cancel_url: `${CLIENT_URL}/cart`,
    });

    res.json({ session_id: session.id });
  } catch (error) {
    console.error(error);
  }
};

const onPaymentComplete = async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      `${WEBHOOK_SIGNING_SECRET}`
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session);

    // Payment is successful and the order is created.
    // You can add your business logic here (e.g. update your database, send a confirmation email, etc.)
    console.log(`Payment was successful for session id ${session.id}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

export {
  onPaymentSetup,
  onPaymentSetupRefresh,
  onStripeReturn,
  onCreateSubscription,
  onCreateCustomer,
  onPurchase,
  onPaymentComplete,
};
