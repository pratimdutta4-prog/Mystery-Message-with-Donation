import mongoose, { Document, Schema } from "mongoose";

export type PaymentType =
    | 'ONE_TIME'
    | 'INSTALLMENT'
    | 'SUBSCRIPTION'
    | 'REFUND'
    | 'PARTIALLY_REFUND';

const paymentTypeEnum = [
    'ONE_TIME',
    'INSTALLMENT',
    'SUBSCRIPTION',
    'REFUND',
    'PARTIALLY_REFUND'
];

export type PaymentStatus =
    | 'DUE'
    | 'PAID'
    | 'FAILED'
    | 'CANCELLED'

export const paymentStatusEnum = [
    'DUE',
    'PAID',
    'FAILED',
    'CANCELLED'
];

export interface IPaymentDetails extends Document {
    payer_id: mongoose.Types.ObjectId;
    receiver?: string;
    type: PaymentType;
    status: PaymentStatus;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    currency: string;
    stripePaymentIntentId?: string;
    purpose?: string;
    metadata?: Record<string, any>;

    createdAt: Date;
    updatedAt: Date;

    /*iPayment: {
        status: PaymentStatus;
        amount: number;
        stripePaymentIntentId?: string;
        stripeChargeId?: string;
        receiptUrl?: string;
        paidAt?: Date;
    }[];*/
    /*subscription?: {
        stripeSubscriptionId: string;
        stripePriceId: string;
        status: SubscriptionStatus;
        periodStart: Date;
        periodEnd: Date;
        cancelAtPeriodEnd: boolean;
    };*/
}

const PaymentDetailsSchema = new Schema<IPaymentDetails>(
    {
        payer_id: {
            type: Schema.Types.ObjectId,
            ref: 'Payer',
            required: [true, 'Payer id is required in Payment Details.'],
        },
        receiver: String,
        type: {
            type: String,
            enum: paymentTypeEnum,
            default: 'ONE_TIME',
            required: [true, 'Payment Details type is required.'],
        },
        status: {
            type: String,
            enum: paymentStatusEnum,
            default: 'DUE',
            required: [true, 'Payment Details status is required.'],
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is reqired in Payment Details.'],
            min: [0, `Total amount can't be negative in Payment Details.`]
        },
        paidAmount: {
            type: Number,
            required: [true, 'Paid amount is reqired in Payment Details.'],
            min: [0, `Paid amount can't be negative in Payment Details.`]
        },
        dueAmount: {
            type: Number,
            required: [true, 'Due amount is reqired in Payment Details.'],
            min: [0, `Due amount can't be negative in Payment Details.`]
        },
        currency: {
            type: String,
            required: [true, 'Currency is required in Payment Details.'],
            uppercase: true,
            default: 'INR'
        },
        stripePaymentIntentId: {
            type: String
        },
        purpose: {
            type: String,
            maxLength: [150, `Payment purpose can't exceed 150 charecters.`]
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true,
    }
);

PaymentDetailsSchema.index({ payer_id: 1 });
PaymentDetailsSchema.index({ status: 1 });

const PaymentDetailsModel = mongoose.models.PaymentDetails as mongoose.Model<IPaymentDetails> ||
    mongoose.model<IPaymentDetails>('PaymentDetails', PaymentDetailsSchema);

export default PaymentDetailsModel;