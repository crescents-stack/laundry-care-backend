// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_26PHem9AhJZvU623DfE1x4sd');

const MakePaymentIntendWithAmount = async (amount) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });

    return await paymentIntent;
}

module.exports = MakePaymentIntendWithAmount