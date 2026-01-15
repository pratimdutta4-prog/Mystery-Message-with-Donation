import mongoose, { Document, Schema } from "mongoose";

export type RefundStatus =
    | 'PENDING'
    | 'SUCCESSED'
    | 'FAILED';

const refundStatusEnum = [
    'PENDING',
    'SUCCESSED',
    'FAILED'
];

export interface IRefund extends Document {
    paymentDetails_id: mongoose.Types.ObjectId;
    stripeRefundId: string;
    amount: number;
    currency: string;
    reason?: string;
    status: RefundStatus;
    refundAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const RefundSchema = new Schema<IRefund>(
    {
        paymentDetails_id: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentDetails',
            required: true
        },
        stripeRefundId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            maxLength: [150, `Refund reason can't exceed 150 charecters.`]
        },
        status: {
            type: String,
            enum: refundStatusEnum,
            default: 'PENDING',
            required: true
        },
        refundAt: {
            type: Date,
            default: Date.now,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const RefundModel = mongoose.models.Refund as mongoose.Model<IRefund> ||
    mongoose.model<IRefund>('Refund', RefundSchema);

export default RefundModel;