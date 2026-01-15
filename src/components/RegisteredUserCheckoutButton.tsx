'use client';

import { ApiResponse } from "@/types/ApiResponse";
import { CheckoutRequestProps } from "@/types/Checkout";
import axios, { AxiosError } from "axios";
import { useState } from "react";


export default function RegisteredUserCheckoutButton({
    purpose,
    amount,
    currency,
    priceId ,
    name,
    image,
    quantity,
    customer_email,
    metadata
}: CheckoutRequestProps) {
    const [loader, setLoader] = useState(false);

    const handleCheckoutClick = async () => {
        setLoader(true);

        try {
            /*
            const response = await fetch('/api/stripe-payment/checkout-session', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    purpose,
                    amount
                })
            });
            const data = await response.json();
            */
            const response = await axios.post(
                '/api/stripe-payment/checkout-session',
                {
                    purpose,
                    amount
                }
            );
            window.location.href = response?.data?.data?.url;
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError?.response?.data?.message
                || 'Payment checkout session failed.';
        } finally {
            setLoader(false);
        }
    };

    return <button
        className="px-4 py-2 rounded bg-black text-white"
        disabled={loader}
        onClick={handleCheckoutClick}
    >
        {
            loader
                ? 'Redirecting...'
                : 'Pay Now'
        }
    </button>;
}