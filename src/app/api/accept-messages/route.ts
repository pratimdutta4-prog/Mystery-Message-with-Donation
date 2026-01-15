import { getServerSession } from "next-auth";
import { User } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { createResponse } from "@/helpers/apiResponses";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return createResponse(
            false,
            'Unauthenticate user request.',
            401
        );
    }
    const userId = user._id;
    const { isAcceptingMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages },
            { new: true }
        );

        if (!updatedUser) {
            return createResponse(
                false,
                'Failed to update user to accept messages.',
                500
            );
        }
        return createResponse(
            true,
            'Message acceptance status updated successfully.',
            200,
            updatedUser
        );
    } catch (error) {
        return createResponse(
            false,
            'Failed to update user status to accept messages.',
            500,
            null,
            error
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return createResponse(
            false,
            'Unauthenticate user request.',
            401
        );
    }
    const userId = user._id;
    try {
        const foundUserById = await UserModel.findById(userId);

        if (!foundUserById) {
            return createResponse(
                false,
                'User not found.',
                404
            );
        }
        return createResponse(
            true,
            'User found successfully.',
            200,
            { isAcceptingMessages: foundUserById.isAcceptingMessages }
        );
    } catch (error) {
        return createResponse(
            false,
            'Can`t getting status of messages acceptance.',
            500
        );
    }
}