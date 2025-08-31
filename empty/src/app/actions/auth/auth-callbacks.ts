import { connectMongoDB } from "@/app/actions/mongo/mongodb";
import User from "@/app/models/user";
import type { User as NextAuthUser } from "next-auth";
import {createSession} from "@/app/actions/session/session";

export async function handleSignIn(user: NextAuthUser): Promise<boolean> {
    await connectMongoDB();

    if (!user.email) {
        throw new Error("Google account has no email associated.");
    }

    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
        let uniqueName = user.name?.replace(/\s+/g, "").toLowerCase() || "user";
        let nameExists = await User.findOne({ name: uniqueName });

        while (nameExists) {
            const randomNum = Math.floor(Math.random() * 10000);
            uniqueName = `${user.name?.replace(/\s+/g, "").toLowerCase() ?? "user"}${randomNum}`;
            nameExists = await User.findOne({ name: uniqueName });
        }

        await User.create({
            name: uniqueName,
            email: user.email,
            image: user.image || "",
            isOAuth: true,
        });
    } else {
        await createSession(existingUser._id.toString());
    }

    return true;
}
