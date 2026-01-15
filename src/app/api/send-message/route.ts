import { createResponse } from "@/helpers/apiResponses";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from '@/model/User';

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return createResponse(
                false,
                'Requested user not found.',
                404
            );
        }
        //is user accepting messages
        if (!user.isAcceptingMessages) {
            return createResponse(
                false,
                'User is not accepting messages.',
                403
            );
        }
        const newMessage = { content, createdAt: new Date() };

        user.messages.push(newMessage as Message);
        await user.save();

        return createResponse(
            true,
            'Message sent successfully.',
            200
        );
    } catch (error) {
        return createResponse(
            false,
            'Something unexpected happening: No user found to sent message.',
            500,
            null,
            error
        );
    }
}