import mongoose, { Document, Schema } from "mongoose";

export type SubscriptionStatus =
    | 'ACTIVE'
    | 'ADVANCE_PAID'
    | 'DUE'
    | 'CANCELED'
    | 'TRAILING'
    | 'INCOMPLETE';

export const subscriptionEnum = [
    'ACTIVE',
    'ADVANCE_PAID',
    'DUE',
    'CANCELED',
    'TRAILING',
    'INCOMPLETE'
];

export interface ISubscription extends Document {
    paymentDetails_id: mongoose.Types.ObjectId;
    stripeSubscriptionId: string;
    stripePriceId: string;
    status: SubscriptionStatus;
    periodStart: Date;
    periodEnd: Date;
    cancelAtPeriodEnd: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        paymentDetails_id: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentDetails',
            required: true
        },
        stripeSubscriptionId: {
            type: String,
            required: true
        },
        stripePriceId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: subscriptionEnum,
            default: 'ACTIVE',
            required: true
        },
        periodStart: {
            type: Date,
            required: true,
            default: Date.now
        },
        periodEnd: {
            type: Date,
            required: true
        },
        cancelAtPeriodEnd: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const SubscriptionModel = mongoose.models.Subscription as mongoose.Model<ISubscription> ||
    mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default SubscriptionModel;