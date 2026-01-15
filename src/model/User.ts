import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;  // s= small letter // use ';'
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,  // s= capital letter
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    phone: string;
    isPhoneVerified: boolean;
    verifyPhoneCodeExpiry: Date;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 charesters long.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone no. is required.'],
        unique: true,
        match: [/^\d{10}$/, 'Invalid phone no.']
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verifyPhoneCodeExpiry: {
        type: Date
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required.']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify code expiry is required.']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('User', UserSchema);

export default UserModel;