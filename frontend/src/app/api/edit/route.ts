import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/app/actions/mongo/mongodb';
import User from '@/app/models/user';
import { getRawSession } from '@/app/actions/session/session-user';

export async function POST(req: Request) {
    const sessionUser = await getRawSession()
    if (!sessionUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { img, img_key, name, tag, bio }: { img: string; img_key: string; name: string; tag: string; bio: string } = await req.json();

    await connectMongoDB();
    await User.findByIdAndUpdate(sessionUser.userId, {
        image: img,
        image_key: img_key,
        name,
        tag,
        bio,
        isProfileComplete: true,
    });

    return NextResponse.json({ success: true });
}
