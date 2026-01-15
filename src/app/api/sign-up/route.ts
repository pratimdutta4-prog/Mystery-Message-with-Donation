import bcrypt from 'bcryptjs';

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { createResponse } from '@/helpers/apiResponses';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password, phone } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return createResponse(
                false,
                'User is already verified.',
                400
            );
        }
        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return createResponse(
                    false,
                    'User already exists with this email.',
                    400
                );
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();

                // send verification email
                //-
                const emailResponse = await sendVerificationEmail(email, username, verifyCode);

                if (!emailResponse.success) {
                    return createResponse(
                        false,
                        'Failed to sent user verification email.',
                        500,
                        null,
                        emailResponse.message
                    );
                }
                return createResponse(
                    true,
                    'Verification email sent again. Please check your inbox.',
                    200
                );
                //-
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

            const newUser = new UserModel({
                username,
                password: hashedPassword,
                email,
                phone,
                isPhoneVerified: false,
                verifyPhoneCodeExpiry: null,
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();

            //send verification email
            const emailResponse = await sendVerificationEmail(email, username, verifyCode);

            if (!emailResponse.success) {
                return createResponse(
                    false,
                    'Failed to sent verification email.',
                    500,
                    null,
                    emailResponse.message
                );
            }
            return createResponse(
                true,
                'User registered successfully. Please verify your email.',
                201
            );
        }
    } catch (error) {
        return createResponse(
            false,
            'Error in registering user.',
            500
        );
    }
}