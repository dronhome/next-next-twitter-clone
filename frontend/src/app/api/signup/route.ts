import { connectMongoDB } from "@/app/actions/mongo/mongodb";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { email, password }: { email: string; password: string } = await req.json();

        await connectMongoDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashedPassword });

        return NextResponse.json({ message: "User registered." }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /signup:", error);
        return NextResponse.json(
            { message: "An error has occurred while registering the user." },
            { status: 500 }
        );
    }
}
