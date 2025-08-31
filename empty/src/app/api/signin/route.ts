import { connectMongoDB } from "@/app/actions/mongo/mongodb";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { createSession } from "@/app/actions/session/session";
import bcrypt from "bcrypt";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { email, name, password }: { email: string; name: string; password: string } = await req.json();

        await connectMongoDB();

        const user = await User.findOne({
            $or: [{ email }, { name }],
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.password) {
            return NextResponse.json({ message: "User has no password set" }, { status: 401 });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        await createSession(user._id.toString()); 

        return NextResponse.json({
            success: true,
            user: { id: user._id.toString(), name: user.name, email: user.email },
        });

    } catch (error) {
        console.error("Error in POST /signin:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
