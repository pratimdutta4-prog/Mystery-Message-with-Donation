import { createResponse } from "@/helpers/apiResponses";
import dbConnect from "@/lib/dbConnect";
import { stripe } from "@/lib/stripe";
import PayerModel from "@/model/Payer";
import PaymentDetailsModel from "@/model/PaymentDetails";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const requestBody = await req.json();

        const {
            name,
            email,
            phone,
            receiver,
            amount,
            currency,
            type,
            purpose,
            metadata
        } = requestBody;

        if (!name || !email || !phone || !receiver || !amount || !currency || !type || !purpose) {
            return createResponse(
                false,
                'Required fields are missing in request.',
                400
            );
        }

        // Create Stripe Customer
        const customer = await stripe.customers.create({
            name,
            email,
            phone,
            metadata
        });

        // Save Payer
        const payer = await PayerModel.create({
            name,
            email,
            phone,
            stripeCustomerId: customer.id
        });

        // Save PaymentDetails
        const paymentDetails = await PaymentDetailsModel.create({
            payer_id: payer.id,
            receiver,
            type,
            status: 'DUE',
            totalAmount: amount,
            paidAmount: 0,
            dueAmount: amount,
            currency,
            purpose,
            metadata
        });

        const paymentIntents = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency,
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
                //allow_redirects: 'never'
            },
            //payment_method_types: ["card"],
            metadata: {
                paymentDetailsId: (paymentDetails._id as mongoose.Types.ObjectId).toString(),
                purpose
            }
        });

        paymentDetails.stripePaymentIntentId = paymentIntents.id;

        await paymentDetails.save();

        return NextResponse.json({
            clientSecret: paymentIntents.client_secret
        });

    } catch (error) {
        return createResponse(
            false,
            'Payment failed.',
            500,
            null,
            error
        );
    }
}