'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import { stripePromise } from "@/lib/stripe-client";
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';   //npm install @stripe/react-stripe-js @stripe/stripe-js

import { toast } from "sonner";
import { Button } from "./ui/button";
import { Spinner } from "./ui/shadcn-io/spinner";

function PaymentForm({ amount }: { amount: number }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.error('Something went wrong. Try agin.', {
                position: 'top-center'
            });
            return;
        }

        try {
            setLoading(true);
            setErrorMessage('');

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required'
            });

            error && router.push('/payment/checkout/donation?status=payment_failed');
            paymentIntent?.status === 'succeeded' && router.push('/payment/success');

        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {
                errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>
            }
            <Button
                disabled={!stripe || loading}
                className="w-full bg-black text-white py-3 rounded"
            >
                {
                    loading
                        ? <>
                            <Spinner variant="circle" />Processing...
                        </>
                        : `Pay Now ₹${amount}`
                }
            </Button>
        </form>
    );
}

export default function CheckoutForm({
    clientSecret,
    amount
}: {
    clientSecret: string,
    amount: number
}) {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe'
                }
            }}
        >
            <PaymentForm amount={amount} />
        </Elements>
    );
}