import { getServerSession } from "next-auth";
import { User } from "next-auth";

// import { authOptions } from "../../auth/[...nextauth]/options";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { createResponse } from "@/helpers/apiResponses";

export async function DELETE(request: Request, { params }: { params: { message_id: string } }) {
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

    try {
        const messageId = params.message_id;
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updatedResult.modifiedCount === 0) {
            return createResponse(
                false,
                'Requested message not found.',
                404
            );
        }
        return createResponse(
            true,
            'Message deleted successfully.',
            200
        );
    } catch (error) {
        return createResponse(
            false,
            'Failed to delete message.',
            500
        );
    }
}