import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { createResponse } from "@/helpers/apiResponses";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return createResponse(
            false,
            'Unauthenticated user request.',
            401
        );
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!user || user.length === 0) {
            return createResponse(
                false,
                'Requested user not found.',
                404
            );
        }

        return createResponse(
            true,
            'Messages fetched successfully.',
            200,
            { messages: user[0].messages }
        );
    } catch (error) {
        return createResponse(
            false,
            'Failed to find user.',
            500
        );
    }
}