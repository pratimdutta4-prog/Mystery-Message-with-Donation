'use client';

import { PaymentType } from "@/model/PaymentDetails";
import { ApiResponse } from "@/types/ApiResponse";
import CheckoutForm from "./CheckoutForm";

import { useState } from "react";
import { Spinner } from "./ui/shadcn-io/spinner";
import axios, { AxiosError } from "axios";

export default function UnregisteredUserCheckoutButton({
  amount,
  currency,
  type,
  purpose,
  formTitle,
  metadata,
  extradata
}: {
  amount: number,
  currency: 'inr',
  type: PaymentType,
  purpose: string,
  formTitle: string,
  metadata?: Record<string, any>,
  extradata?: Record<string, any>
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleSetDefaultThis = () => {
    setLoading(false);
    setErrorMessage('');
    setClientSecret(null);
  };

  const handleCloseThisDialog = () => {
    handleSetDefaultThis();
    extradata?.closeParentDialog?.();
  };

  const handleBackToParent = () => {
    handleSetDefaultThis();
    extradata?.goBack?.();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');

    if (!name || !email || !phone) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/stripe-payment/unregistered-user/checkout-intent',
        {
          name,
          email,
          phone,
          amount,
          currency,
          type,
          purpose,
          metadata
        }
      );

      if (!data?.clientSecret) {
        throw new Error('Failed to initiate payment.')
      }

      setClientSecret(data?.clientSecret);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError?.response?.data?.message || 'Payment initiation failed.';

      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>



      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl animate-in fade-in zoom-in-95">

          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-lg font-semibold text-green-800">
              {formTitle}
            </h2>
            <button
              onClick={handleCloseThisDialog}
              className="text-xl font-bold text-gray-500 hover:text-red-600"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            {
              !clientSecret ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700">
                      Name
                    </label>
                    <input
                      name="name"
                      placeholder="John Doe"
                      className="mt-1 w-full rounded-lg border border-green-300 px-3 py-2 focus:border-green-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@email.com"
                      className="mt-1 w-full rounded-lg border border-green-300 px-3 py-2 focus:border-green-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700">
                      Phone
                    </label>
                    <input
                      name="phone"
                      placeholder="9876543210"
                      className="mt-1 w-full rounded-lg border border-green-300 px-3 py-2 focus:border-green-600 focus:outline-none"
                    />
                  </div>

                  {errorMessage && (
                    <div
                      className="rounded-lg bg-red-50 px-3 py-2 
                        text-sm font-semibold text-red-600 animate-pulse"
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBackToParent}
                      className="rounded-lg border border-green-600 
                          px-4 py-2 text-green-700 
                          hover:bg-green-50 transition"
                    >
                      ← Back
                    </button>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCloseThisDialog}
                        className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800 disabled:opacity-70"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            Processing <Spinner variant="ellipsis" />
                          </span>
                        ) : (
                          `Pay ₹${amount}`
                        )}
                      </button>
                    </div>
                  </div>

                </form>
              ) : (
                <CheckoutForm clientSecret={clientSecret} amount={amount} />
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};