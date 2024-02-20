"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPaymentComplete = exports.onPurchase = exports.onCreateCustomer = exports.onCreateSubscription = exports.onStripeReturn = exports.onPaymentSetupRefresh = exports.onPaymentSetup = void 0;
const payment_1 = __importDefault(require("../config/payment"));
const index_1 = require("../constants/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
// Onboarding route
const onPaymentSetup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cookies = req.cookies;
    if (!cookies.refreshToken)
        return res.status(401).send("unauthorized");
    let payload;
    let refreshToken = cookies.refreshToken;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, index_1.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send("Unauthorized");
    }
    let { creator_id } = payload;
    try {
        let { rows } = yield (0, db_1.query)("SELECT * FROM creator WHERE creator_id = $1", [
            creator_id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Creator not found" });
        }
        if (req.query.error) {
            const error = req.query.error;
            return res.status(400).json({ error: error.error_description });
        }
        // Check if a Stripe account already exists for the user
        const { rows: stripeRows } = yield (0, db_1.query)("SELECT * FROM stripe_account WHERE creator_id = $1", [creator_id]);
        if (stripeRows.length > 0) {
            let stripeAccountId = stripeRows[0].stripe_account_id;
            // Update the Stripe account with the new information
            yield payment_1.default.accounts.update(stripeAccountId, {
                email: req.body.email,
                individual: {
                    email: req.body.email,
                    phone: req.body.phone,
                },
                // Here to add any other fields that might have changed
            });
            // Create a new account link for the existing account
            const accountLink = yield payment_1.default.accountLinks.create({
                account: stripeAccountId,
                refresh_url: `${index_1.SERVER_URL}/reauth`,
                return_url: `${index_1.SERVER_URL}/stripe/return?creator_id=${creator_id}`,
                type: "account_onboarding",
            });
            res.json({ URL: accountLink.url });
        }
        else {
            // No Stripe account exists for the user, so create a new one
            const account = yield payment_1.default.accounts.create({
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
            const accountResponse = yield getAccount(accountId);
            if (accountResponse.error) {
                return res.status(400).json({ error: accountResponse.error });
            }
            let stripe_email = accountResponse.email;
            let business_profile = accountResponse.business_profile;
            let capabilities = accountResponse.capabilities;
            let country = accountResponse.country;
            let time_created = accountResponse.created;
            let default_currency = accountResponse.default_currency;
            const client = yield db_1.pool.connect();
            try {
                yield client.query("BEGIN");
                yield client.query("UPDATE creator SET stripe_account_id = $1 WHERE creator_id = $2", [accountId, creator_id]);
                const { rows } = yield client.query("SELECT * FROM stripe_account WHERE creator_id = $1", [creator_id]);
                if (rows.length === 0) {
                    yield client.query("INSERT INTO stripe_account (stripe_account_id, creator_id, email, business_profile, capabilities, country, created, default_currency) VALUES($1, $2, $3, $4, $5, $6, to_timestamp($7), $8)", [
                        accountId,
                        creator_id,
                        stripe_email,
                        business_profile,
                        capabilities,
                        country,
                        time_created,
                        default_currency,
                    ]);
                }
                yield client.query("COMMIT");
            }
            catch (error) {
                yield client.query("ROLLBACK");
                throw error;
            }
            finally {
                client.release();
            }
            const accountLink = yield payment_1.default.accountLinks.create({
                account: account.id,
                refresh_url: `${index_1.SERVER_URL}/reauth`,
                return_url: `${index_1.SERVER_URL}/stripe/return?creator_id=${creator_id}`,
                type: "account_onboarding",
            });
            res.json({ URL: accountLink.url });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
exports.onPaymentSetup = onPaymentSetup;
// This function is used to get the account details from the stripe API
const getAccount = (connectedAccountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield payment_1.default.accounts.retrieve(connectedAccountId);
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
    }
    catch (error) {
        return { error: error.message };
    }
});
// Catch the return URL from Stripe
const onStripeReturn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creator_id } = req.query;
    try {
        const { rows } = yield (0, db_1.query)("SELECT * FROM creator WHERE creator_id = $1", [creator_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Creator not found" });
        }
        let creator_stripe_account_id = rows[0].stripe_account_id;
        const accountResponse = yield getAccount(creator_stripe_account_id);
        if (accountResponse.error) {
            return res.status(400).json({ error: accountResponse.error });
        }
        const client = yield db_1.pool.connect();
        if (accountResponse.is_charges_enabled &&
            accountResponse.is_payout_enabled) {
            yield client.query("UPDATE creator SET is_stripe_connected = $1 WHERE creator_id = $2", ["ACTIVE", creator_id]);
        }
        res.redirect(`${index_1.CLIENT_URL}/edit-profile/${rows[0].username}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
exports.onStripeReturn = onStripeReturn;
// Refresh route
const onPaymentSetupRefresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cookies = req.cookies;
    if (!cookies.refreshToken)
        return res.status(401).send("unauthorized");
    let payload;
    let refreshToken = cookies.refreshToken;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, index_1.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send("Unauthorized");
    }
    let { creator_id } = payload;
    try {
        let { rows } = yield (0, db_1.query)("SELECT * FROM creator WHERE creator_id = $1", [
            creator_id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Creator not found" });
        }
        let creator_username = rows[0].username;
        const { rows: stripeRows } = yield (0, db_1.query)("SELECT * FROM stripe_account WHERE creator_id = $1", [creator_id]);
        if (stripeRows.length === 0) {
            return res.status(404).json({ error: "Stripe account not found" });
        }
        let stripeAccountId = stripeRows[0].stripe_account_id;
        const accountLink = yield payment_1.default.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${index_1.SERVER_URL}/reauth`,
            return_url: `${index_1.CLIENT_URL}/edit-profile/${creator_username}`,
            type: "account_onboarding",
        });
        res.json({ URL: accountLink.url });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
exports.onPaymentSetupRefresh = onPaymentSetupRefresh;
// This function is to create a customer to do subscription,
// which the person who is subscripting to pay the creator, AKA Simp;
const onCreateCustomer = (email, accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield payment_1.default.customers.create({
            email: email,
        }, {
            stripeAccount: accountId,
        });
        return { id: customer.id };
    }
    catch (error) {
        return { error: error.message };
    }
});
exports.onCreateCustomer = onCreateCustomer;
// This is to do the subscription functionality;
// What are the priceId and AccountId?
const onCreateSubscription = (customerId, priceId, accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscription = yield payment_1.default.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            expand: ["latest_invoice.payment_intent"],
        }, {
            stripeAccount: accountId,
        });
        return { id: subscription.id };
    }
    catch (error) {
        console.error(`Failed to create subscription for customer ${customerId} on account ${accountId}: ${error.message}`);
        // You might want to send an email to your support team, log the error to an error tracking service, etc.
        return { error: error.message };
    }
});
exports.onCreateSubscription = onCreateSubscription;
const onPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { fan_email, message, is_to_publish, cart, simp_name, surpriseGift } = req.body;
    let creator_id = ((_a = cart[0]) === null || _a === void 0 ? void 0 : _a.creator_id) || ((_b = surpriseGift[0]) === null || _b === void 0 ? void 0 : _b.creator_id);
    const uuid = (0, uuid_1.v4)();
    const purchasing_identifier = crypto_1.default
        .createHash("sha256")
        .update(uuid)
        .digest("hex")
        .substring(0, 8);
    try {
        let lineItems = [];
        let creatorAmount = 0;
        let amount_spent = 0;
        let fanAmount = 0;
        let wish_count = cart.length;
        const fan_message_to_creator = message ? message : null;
        const fan_name = simp_name ? simp_name : null;
        let wish_info = cart.map((item) => {
            return {
                wish_id: item.wish_id,
                wish_name: item.wish_name,
                wish_price: item.wish_price,
                quantity: item.quantity,
            };
        });
        // Adjust the amount that the fan pays and the creator receives
        let totalAmount = cart.reduce((acc, item) => {
            return acc + Number(item.wish_price) * Number(item.quantity);
        }, 0);
        let { rows } = yield (0, db_1.query)("SELECT * FROM creator WHERE creator_id = $1", [
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
        if (cart.length > 0) {
            cart.map((item) => {
                lineItems.push({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Gift donation funds for ${item.wish_name}.`,
                            images: ["https://paymenticons.s3.amazonaws.com/giftbox.png"],
                        },
                        unit_amount: item.wish_price * 100,
                    },
                    quantity: item.quantity,
                });
            });
        }
        // Add the surprise gift to the total amount
        if (surpriseGift.length > 0) {
            totalAmount += surpriseGift.reduce((acc, item) => {
                return acc + Number(item.amount);
            }, 0);
        }
        // Add the surprise gift as a separate line item
        if (surpriseGift.length > 0) {
            surpriseGift.map((item, i) => {
                lineItems.push({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Surprise Gift Donation",
                            images: ["https://paymenticons.s3.amazonaws.com/giftbox.png"],
                        },
                        unit_amount: item.amount * 100,
                    },
                    quantity: i + 1,
                });
            });
        }
        // Calculate the total fee
        let totalFee = totalAmount * 0.1;
        creatorAmount = totalAmount * 0.9; // Creator receives 10% less
        fanAmount = totalAmount * 1.1; // Fan pays 10% more
        amount_spent = fanAmount;
        let format = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        });
        format.format(parseFloat(totalFee) / 100);
        format.format(parseFloat(creatorAmount) / 100);
        format.format(parseFloat(fanAmount) / 100);
        // Add the fee as a separate line item
        lineItems.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Wishties Fee",
                    images: ["https://paymenticons.s3.amazonaws.com/fav.png"],
                },
                unit_amount: totalFee * 100, // Convert to cents
            },
            quantity: 1,
        });
        // Check if the fan already exists in the database, if not, create their id and add them to the fan table;
        let is_fan_exists = yield (0, db_1.query)("SELECT * FROM fan WHERE fan_email = $1", [
            fan_email,
        ]);
        if (is_fan_exists.rows.length === 0) {
            let fan_id = (0, uuid_1.v4)();
            yield (0, db_1.query)("INSERT INTO fan (fan_id, fan_email, fan_name) VALUES ($1, $2, $3) ON CONFLICT (fan_email) DO NOTHING", [fan_id, fan_email, fan_name]);
        }
        // Then, get the fan_id from the fan table, and add their id to the relative tables;
        let fan = yield (0, db_1.query)("SELECT * FROM fan WHERE fan_email = $1", [
            fan_email,
        ]);
        let fan_id = fan.rows[0].fan_id;
        // CREATE A PURCHASE INFO TABLE;
        yield (0, db_1.query)("INSERT INTO purchases_info (fan_id, purchased_gifts, wish_info, amount_spent, purchase_identifier) VALUES ($1, $2, $3, $4, $5)", [
            fan_id,
            wish_count,
            JSON.stringify(wish_info),
            amount_spent,
            purchasing_identifier,
        ]);
        yield (0, db_1.query)("INSERT INTO fan_messages (fan_id, creator_id, message_text, purchase_identifier, is_to_publish) VALUES ($1, $2, $3, $4, $5)", [
            fan_id,
            creator_id,
            fan_message_to_creator,
            purchasing_identifier,
            is_to_publish, // If this is false, the message will be published on the creator's profile if it's true don't publish it
        ]);
        // Add the fan to the creator's fan_supported table
        let is_fan_supported = yield (0, db_1.query)("SELECT * FROM creators_fan_supported WHERE fan_id = $1 AND creator_id = $2", [fan_id, creator_id]);
        if (is_fan_supported.rows.length === 0) {
            yield (0, db_1.query)("INSERT INTO creators_fan_supported (fan_id, creator_id, is_fan_supported, supported_number_of_time) VALUES ($1, $2, TRUE, 1)", [fan_id, creator_id]);
        }
        else {
            yield (0, db_1.query)("UPDATE creators_fan_supported SET supported_number_of_time = supported_number_of_time + 1 WHERE fan_id = $1 AND creator_id = $2", [fan_id, creator_id]);
        }
        const session = yield ((_c = payment_1.default.checkout.sessions) === null || _c === void 0 ? void 0 : _c.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            payment_intent_data: {
                application_fee_amount: (fanAmount - creatorAmount) * 100,
                transfer_data: {
                    destination: stripe_account_id,
                },
                metadata: {
                    fan_id: fan_id,
                    creator_id: creator_id,
                    purchasing_identifier: purchasing_identifier,
                },
            },
            mode: "payment",
            success_url: `${index_1.CLIENT_URL}/payment/success`,
            cancel_url: `${index_1.CLIENT_URL}/cart`,
        }));
        res.json({ session_id: session.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
exports.onPurchase = onPurchase;
const onPaymentComplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let event = null;
    let sig = req.headers["stripe-signature"];
    if (!sig) {
        return res.status(400).send("Stripe Signature is missing");
    }
    try {
        event = payment_1.default.webhooks.constructEvent(req.rawBody, sig, index_1.WEBHOOK_SIGNING_SECRET);
    }
    catch (err) {
        console.log("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntentSucceeded = event.data.object;
            // Access the metadata
            const fan_id = paymentIntentSucceeded.metadata.fan_id;
            const creator_id = paymentIntentSucceeded.metadata.creator_id;
            const purchasing_identifier = paymentIntentSucceeded.metadata.purchasing_identifier;
            // Update the purchase info table
            yield (0, db_1.query)("UPDATE purchases_info SET is_purchase_completed = $1 WHERE purchase_identifier = $2", [true, purchasing_identifier]);
            // Update the fan_supported table to indicate that the fan has bought the wish/es and supported the creator
            yield (0, db_1.query)("UPDATE creators_fan_supported SET is_fan_supported = $1 WHERE fan_id = $2 AND creator_id = $3", [true, fan_id, creator_id]);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
});
exports.onPaymentComplete = onPaymentComplete;
