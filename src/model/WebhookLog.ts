import mongoose, { Document, Schema } from "mongoose";

export interface IWebhookLog extends Document {
    eventId: string;
    type: string;
    processed: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const WebhookLogSchema = new Schema<IWebhookLog>(
    {
        eventId: {
            type: String,
            unique: true
        },
        type: {
            type: String
        },
        processed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const WebhookLogModel = mongoose.models.WebhookLog as mongoose.Model<IWebhookLog> ||
    mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema);

export default WebhookLogModel;