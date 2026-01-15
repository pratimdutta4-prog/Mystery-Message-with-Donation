import twilio from "twilio"; //npm i twilio
import { createResponse } from "@/helpers/apiResponses";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, phone } = await req.json();

        if (!phone) {
            return createResponse(
                false,
                'Failed to process the request.',
                400
            );
        }

        const user = await UserModel.findOne({ username }).select(phone);

        if (!user) {
            return createResponse(
                false,
                'Phone no. not registered.',
                404
            );
        }

        const verificationCodeSend = await twilioClient.verify.v2
            .services(process.env.TWILIO_MYSTERY_SERVICE_SID!)
            .verifications.create({
                to: phone,
                channel: "sms"
            });
        //console.log('>> Twilio sent phone code verification: ', verificationCodeSend);

        const otpExpiry = new Date(Date.now() + 90 * 1000);
        user.verifyPhoneCodeExpiry = otpExpiry;

        await user.save();

        const verificationCodeSendStatus = verificationCodeSend.status === 'pending';

        return createResponse(
            verificationCodeSendStatus,
            verificationCodeSendStatus
                ? 'Successfully phone OTP sent to +91 xxxxxxxx' + phone.slice(-2)
                : 'OTP unavailable, try again',
            verificationCodeSendStatus
                ? 200
                : 410,
            verificationCodeSendStatus 
                ? { otpExpiry }
                : null
        );
    } catch (error) {
        return createResponse(
            false,
            'Failed to sent phone OTP.',
            500,
            undefined,
            error
        );
    }
}