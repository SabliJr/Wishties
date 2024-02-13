const cron = require('node-cron');

// This file is used to run internal algorithms that are not directly related to the API
// For example, you could use this file to run a cron job that deletes unverified accounts every day
// You can read more about cron jobs here: https://www.npmjs.com/package/node-cron
// You can also use this file to run any other internal algorithms that you want to run in the background
// For example, you could use this file to run a machine learning model in the background
// Or you could use this file to run a script that sends out emails to users every day
// Or you could use this file to run a script that generates a report every day
// Or you could use this file to run a script that updates the database every day
// Or you could use this file to run a script that does any other background task
// You can use this file to delete all unclosed payment intents every day

// This will run every day at 12:00 AM
// cron.schedule('0 0 * * *', async () => {
//   // Fetch all unverified accounts
//   const unverifiedAccounts = await getUnverifiedAccounts();
//   for (const account of unverifiedAccounts) {
//     // Delete the account
//     await deleteAccount(account.id);
//   }

//   // Fetch all incomplete payment intents
//   const incompletePaymentIntents = await getIncompletePaymentIntents();
//   for (const paymentIntent of incompletePaymentIntents) {
//     // Cancel the payment intent
//     await stripe.paymentIntents.cancel(paymentIntent.id);
//   }
// });