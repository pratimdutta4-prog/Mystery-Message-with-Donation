import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        
    } catch (error) {
        
    }
}