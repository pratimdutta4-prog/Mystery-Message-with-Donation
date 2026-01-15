export type CheckoutPurpose =
    | "one-time"
    | "installment"
    | "subscription";

export type CheckoutRequestProps = {
    purpose: CheckoutPurpose,
    amount?: number,
    currency?: string,
    priceId?: string,
    name?: string,  // product name
    image?: URL,    // product image
    quantity?: number
    customer_email?: string,
    metadata?: Record<string, string>
}