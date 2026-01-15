import { createResponse } from "@/helpers/apiResponses";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
    api: {
        bodyParser: false
    }
};

async function getRawBody(req: Request) {
    const buffer = await req.arrayBuffer();
    return Buffer.from(buffer);
}

export async function POST(req: Request) {
    const stripeSignature = req.headers.get('stripe-signature');

    if (!stripeSignature) {
        return createResponse(
            false,
            'Missing stripe signature.',
            400
        );
    }

    const rawBody = await getRawBody(req);

    try {
        const stripeEvent: Stripe.Event = stripe.webhooks.constructEvent(
            rawBody,
            stripeSignature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        switch (stripeEvent.type) {
            case 'checkout.session.completed': {
                const stripeSession = stripeEvent.data.object as Stripe.Checkout.Session;
                // update DB, make payment success
                // await savePayment(session) 
                break;
            }
            case 'invoice.payment_succeeded': {
                // subscription renewed
                break;
            }
            case 'payment_intent.succeeded': {
                // one time payment successfull
                break;
            }
        }
        return NextResponse.json({ received: true });
    } catch (error: any) {
        return createResponse(
            false,
            error.message,
            400,
            undefined,
            error
        );
    }
}