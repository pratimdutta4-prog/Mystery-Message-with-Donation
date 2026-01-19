import mongoose, { Document, Schema } from "mongoose";

export interface IPayer extends Document {
    name: string;
    email: string;
    phone: string;
    stripeCustomerId: string;

    createdAt: Date;
    updatedAt: Date;
}

const PayerSchema = new Schema<IPayer>(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Payer name is required.'],
            minLength: [2, 'Name should be at least 2 characters.'],
            maxLength: [50, `Name can't exceed 50 characters.`]
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: [true, 'Payer email is required.'],
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Invalid email'
            ]
        },
        phone: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Payer phone no. is required.'],
            match: [/^[0-9]{10}$/, 'Invalid phone no.']
        },
        stripeCustomerId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,    // for auto adds --> createdAt and updatedAt
    }
);

const PayerModel = mongoose.models.Payer as mongoose.Model<IPayer> ||
    mongoose.model<IPayer>('Payer', PayerSchema);

export default PayerModel;