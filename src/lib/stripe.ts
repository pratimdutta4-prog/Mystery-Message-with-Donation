import Stripe from "stripe";    // npm install stripe @stripe/stripe-js

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error('Server unable to load payment system.');
}

export const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY!
);