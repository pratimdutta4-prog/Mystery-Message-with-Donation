import mongoose, { Document, Schema } from "mongoose";

import { PaymentStatus, paymentStatusEnum } from "./PaymentDetails";

export interface IPayment extends Document {
    paymentDetails_id: mongoose.Types.ObjectId;
    status: PaymentStatus;
    amount: number;
    stripePaymentIntentId?: string;
    stripeInvoiceId?: string;
    stripeChargeId?: string;
    receiptUrl?: string;
    paidAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        paymentDetails_id: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentDetails',
            required: true
        },
        status: {
            type: String,
            enum: paymentStatusEnum,
            default: 'DUE',
            required: [true, 'Payment status is required.']
        },
        amount: {
            type: Number,
            required: true
        },
        stripePaymentIntentId: {
            type: String
        },
        stripeInvoiceId: {
            type: String
        },
        stripeChargeId: {
            type: String
        },
        receiptUrl: {
            type: String
        },
        paidAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const PaymentModel = mongoose.models.Payment as mongoose.Model<IPayment> ||
    mongoose.model<IPayment>('payment', PaymentSchema);

export default PaymentModel;