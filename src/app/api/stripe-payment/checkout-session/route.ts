import { createResponse } from "@/helpers/apiResponses";
import { CheckoutPurpose, CheckoutRequestProps } from "@/types/Checkout";
import { stripe } from "@/lib/stripe";

const allowedPurposes: CheckoutPurpose[] = [
    "one-time",
    "subscription"
];

/*
type PaymentChechkoutRequest = {
    purpose: CheckoutPurpose,
    amount: number,
    currency?: string,
    priceId?: string,  
    productId,
    name,
    image,
    quantity?: number
    email?: string,
    metadata?: Record<string, string>
};
*/

export async function POST(req: Request) {
    try {
        //const requestBody = (await req.json()) as PaymentChechkoutRequest;

        const requestBody = await req.json();

        const {
            purpose,
            amount = 0,
            currency = 'inr',
            priceId = '',
            name = 'product_name',
            image = undefined,
            quantity = 1,
            customer_email = "",
            metadata = {}
        }: CheckoutRequestProps = requestBody;

        if (!allowedPurposes.includes(purpose)) {
            return createResponse(
                false,
                "Invalid purpose for payment checkout session.",
                400
            );
        }
        let mode: "payment" | "subscription" = "payment";
        let line_items: any[] = [];

        if (purpose === "subscription") {
            if (!priceId) {
                return createResponse(
                    false,
                    "Price Id required for payment checkout session.",
                    400
                );
            }
            mode = "subscription";
            line_items.push({
                price: priceId,
                quantity
            });
        } else {
            if (!amount || amount < 0) {
                return createResponse(
                    false,
                    "Invalid amount for payment checkout session.",
                    400
                );
            }
            line_items.push({
                price_data: {
                    currency,
                    product_data: {
                        name,
                        image
                    },
                    unit_amount: amount * 100
                },
                quantity
            });
        }
        const session = await stripe.checkout.sessions.create({
            mode,
            payment_method_types: ["card"],
            line_items,
            ...(customer_email && { customer_email }),
            success_url: `${process.env.CLIENT_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_APP_URL}/payment/checkout/donation`,
            metadata: {
                purpose,
                ...metadata
            }
        });
        return createResponse(
            true,
            'Payment checkout session created successfully.',
            200,
            { url: session.url }
        );
    } catch (error) {
        return createResponse(
            false,
            'Payment checkout session failed.',
            500,
            null,
            error
        );
    }
}