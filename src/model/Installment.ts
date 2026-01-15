import mongoose, { Document, Schema } from "mongoose";

import { SubscriptionStatus, subscriptionEnum } from "./Subscription";

export interface IInstallment extends Document {
    paymentDetails_id: mongoose.Types.ObjectId;
    status: SubscriptionStatus;
    totalInstallments: number;
    currentInstallmentNo: number;
    eachInstallmentAmount: number;
    lastInstallmentAmount: number;
    startAt: Date;
    endAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const InstallmentSchema = new Schema<IInstallment>(
    {
        paymentDetails_id: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentDetails',
            requred: true
        },
        status: {
            type: String,
            enum: subscriptionEnum,
            default: 'ACTIVE'
        },
        totalInstallments: {
            type: Number,
            required: true
        },
        currentInstallmentNo: {
            type: Number,
            required: true,
            default: 1
        },
        eachInstallmentAmount: {
            type: Number,
            required: true
        },
        lastInstallmentAmount: {
            type: Number,
            required: true
        },
        startAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        endAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const InstallmentModel = mongoose.models.Installment as mongoose.Model<IInstallment> ||
    mongoose.model<IInstallment>('Installment', InstallmentSchema);

export default InstallmentModel;