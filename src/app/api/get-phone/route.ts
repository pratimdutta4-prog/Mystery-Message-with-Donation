import { createResponse } from "@/helpers/apiResponses";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username)
            return createResponse(
                false,
                'Username missing in unauthenticate request.',
                400
            );
        const phoneDoc = await UserModel.findOne({ username }).select('phone');
        const phone = phoneDoc?.phone || undefined;

        if (!phone)
            return createResponse(
                false,
                'Phone no. not. found.',
                404,
            );
        return createResponse(
            true,
            'Phone no. found.',
            200,
            { phone }
        );
    } catch (error) {
        return createResponse(
            false,
            'Failed to find phone no.',
            500,
            undefined,
            error
        );
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username } = await req.json();
        const phoneDoc = await UserModel.findOne({ username }).select('phone');
        const phone = phoneDoc?.phone || undefined;

        if (!phone)
            return createResponse(
                false,
                'Phone no. not. found.',
                404,
            );
        return createResponse(
            true,
            'Phone no. found.',
            200,
            { phone }
        );

    } catch (error) {
        return createResponse(
            false,
            'Failed to find phone no.',
            500,
            undefined,
            error
        );
    }
}