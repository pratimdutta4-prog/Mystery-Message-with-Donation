import { createResponse } from '@/helpers/apiResponses';
import twilio from 'twilio';

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export default async function POST(req: Request) {
    await dbConnect();

    try {
        const { phone, code } = await req.json();

        if (!phone || !code) {
            return createResponse(
                false,
                'Failed to process the request.',
                400
            );
        }

        const user = await UserModel.findOne({ phone });

        if (!user) {
            return createResponse(
                false,
                'Phone no. not registered.',
                404
            );
        }

        if(user.verifyPhoneCodeExpiry < new Date() ) {
            return createResponse(
                false,
                'OTP expired.',
                410
            );
        }

        const verificationCheck = await twilioClient.verify.v2
            .services(process.env.TWILIO_MYSTERY_SERVICE_SID!)
            .verificationChecks.create({
                to: phone,
                code
            });
        // console.log('>> Twilio check phone varification code: ', verificationCheck);

        const verificationCheckStatus = verificationCheck.status === 'approved';

        return createResponse(
            verificationCheckStatus,
            verificationCheckStatus
                ? 'Valid phone OTP'
                : 'Invalid phone OTP',
            verificationCheckStatus
                ? 200
                : 401
        );
    } catch (error) {
        return createResponse(
            false,
            'Failed to verify phone OTP.',
            500
        );
    }
}