import { NextResponse } from 'next/server'
import { connectMongoDB } from '@/app/actions/mongo/mongodb'
import User from '@/app/models/user'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get('q')?.trim() ?? '';

        if (!q) {
            return NextResponse.json([], { status: 200 });
        }

        await connectMongoDB();
        const users = await User.find(
            {
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { tag:  { $regex: q, $options: 'i' } },
                ],
            },
            'name tag image'
        )
            .limit(10)
            .lean();

        const result = users.map(u => ({
            id:    u._id.toString(),
            name:  u.name,
            tag:   u.tag,
            image: u.image,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in GET /api/users:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
