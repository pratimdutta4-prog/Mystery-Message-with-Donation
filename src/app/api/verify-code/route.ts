import { createResponse } from "@/helpers/apiResponses";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodeUsername });

        if (!user) {
            return createResponse(
                false,
                "User not found.",
                500
            );
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return createResponse(
                true,
                'Account verified successfully.',
                200
            );
        } else {
            if (!isCodeValid) {
                return createResponse(
                    false,
                    'Incorrect verification code.',
                    400
                );
            }
            if (!isCodeNotExpired) {
                return createResponse(
                    false,
                    'Verification code has expired, please sign up again to get a new code.',
                    400
                );
            }
        }
    } catch (error) {
        return createResponse(
            false,
            'Error found to verify user.',
            500
        );
    }
}