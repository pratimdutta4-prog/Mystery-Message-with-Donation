'use client';

import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import UnregisteredUserCheckoutButton from "./UnregisteredUserCheckoutButton";

const PRESET_AMOUNT = [50, 100, 150, 200, 250];

export default function DonateAdv() {
  const [amount, setAmount] = useState<number>(50);
  const [message, setMessage] = useState<string>('Minimum Donation is ₹50.');

  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [step, setStep] = useState<'step1' | 'step2' | null>(null);

  const handleSetDefaultThis = () => {
    setAmount(50);
    setMessage('Minimum Donation is ₹50.');
    setErrorFlag(false);
  };

  const handleCloseThisDialog = () => {
    handleSetDefaultThis();
    setStep(null);
  };

  const handleHighlightMessage = (amountValue: number) => {
    amountValue < 50
      ? setErrorFlag(true)
      : setErrorFlag(false);
  };

  const handleMessage = (amountValue: number) => {
    amountValue <= 50
      ? setMessage('Minimum Donation is ₹50.')
      : setMessage('');

    handleHighlightMessage(amountValue);
  };

  const handlePresetAmountClick = (amountValue: number) => {
    setAmount(amountValue);
    handleMessage(amountValue);
  };

  const handleAmountInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let amountValue = Number(e.target.value);

    setAmount(amountValue);
    handleMessage(amountValue);
  };

  return (
    <>
      {/* DONATION CARD */}
      <div
        className="
          cursor-pointer
          w-full
          max-w-xl
          mx-auto
          rounded-xl
          border border-green-200
          bg-gradient-to-r from-green-50 to-emerald-50
          px-5 py-4
          shadow-sm
          hover:shadow-md
          hover:scale-[1.01]
          transition-all
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-green-700 font-semibold">
              🌱 Make the Planet Green Again
            </p>
            <h3 className="text-lg font-bold text-gray-900">
              Support Tree Plantation & Nature Care
            </h3>
            <p className="text-sm text-gray-600">
              Every donation helps plant trees and restore nature.
            </p>
          </div>

          <button
            onClick={() => setStep('step1')}
            className="
              rounded-lg
              border
              border-green-500
              px-4
              py-2
              text-green-700
              font-semibold
              hover:bg-green-100
            "
          >
            💚 Click Here to Donate
          </button>
        </div>
      </div>

      {/* DIALOG */}
      {step === 'step1' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleCloseThisDialog}
          />

          {/* MODAL BOX */}
          <div
            className="
              relative
              z-50
              w-[95vw]
              max-w-[425px]
              rounded-xl
              bg-white
              p-6
              shadow-2xl
              max-h-[90vh]
              overflow-y-auto
            "
          >
            <button
              onClick={handleCloseThisDialog}
              aria-label="Close dialog"
              className="
                absolute right-4 top-4
                text-gray-400 hover:text-gray-700
                text-xl
              "
            >✕</button>
            <h2 className="text-lg font-bold text-gray-900">
              🌱 Your donation helps plant trees
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Even a small contribution can help restore nature and reduce
              carbon footprint.
            </p>

            {/* PRESET BUTTONS */}
            <div className="flex flex-wrap gap-3 mt-4">
              {PRESET_AMOUNT.map((value) => (
                <button
                  key={value}
                  onClick={() => handlePresetAmountClick(value)}
                  className={`
                    px-4 py-2 rounded-full border text-sm font-semibold
                    ${amount === value
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                    }
                  `}
                >
                  Donate ₹{value} = {value / 50} tree{value > 50 ? "s" : ""}
                </button>
              ))}
            </div>

            {/* INPUT */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Amount (₹)
              </label>
              <input
                type="number"
                min={50}
                value={amount}
                onChange={handleAmountInputChange}
                className="
                  w-full
                  rounded-lg
                  border
                  border-green-300
                  bg-green-50
                  px-4
                  py-2
                  text-gray-900
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              />
              <div
                className={`
                  mt-1
                  flex items-start gap-2
                  px-3 py-2
                  text-sm
                  ${errorFlag
                    ? 'text-red-800 font-semibold'
                    : 'text-green-800 animate-pulse'
                  }
                `}
              >
                {
                  message && <span>⚠️{' '}{message}</span>
                }
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseThisDialog}
                className="
                  rounded-lg
                  border
                  px-4
                  py-2
                  text-gray-700
                  hover:bg-gray-100
                "
              >
                Cancel
              </button>

              {
                errorFlag
                  ? <button
                    type="button"
                    onClick={() => toast.error(message, {
                      position: 'top-center'
                    })}
                  >
                    {`🚫 Donate ₹${amount} Now`}
                  </button>
                  : <button
                    type="button"
                    onClick={() => setStep('step2')}
                  >
                    {`💚 Donate ₹${amount} Now`}
                  </button>
              }
            </div>

            <p className="mt-4 text-sm text-gray-500 text-center">
              🌍 Every ₹50 helps plant at least one tree
            </p>
          </div>
        </div>
      )}
      {
        step === 'step2' && (
          <UnregisteredUserCheckoutButton
            receiver='mysteryMsg'
            amount={amount}
            currency="inr"
            type="ONE_TIME"
            purpose="donation for plant"
            formTitle="Payment Methods"
            extradata={{
              closeParentDialog: () => handleCloseThisDialog(),
              goBack: () => {
                setStep('step1');
                handleSetDefaultThis();
              }
            }}
          />
        )
      }
    </>
  );
}
