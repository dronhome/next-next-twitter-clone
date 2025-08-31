import { connectMongoDB } from "@/app/actions/mongo/mongodb";
import Post from "@/app/models/post";
import Like from "@/app/models/like";
import { Types } from "mongoose";
import {getRawSession} from "@/app/actions/session/session-user";

interface IUser {
    _id: Types.ObjectId;
    name: string;
    tag: string;
    image: string;
}

interface IPost {
    _id: Types.ObjectId;
    title: string;
    body: string;
    image: string;
    author: Types.ObjectId;
    createdAt: Date;
}

type PostWithPopulatedAuthor = Omit<IPost, "author"> & {
    author: IUser;
};

export interface PopulatedPost {
    _id: string;
    title: string;
    body: string;
    image?: string;
    createdAt: string;
    author: {
        _id: string;
        name: string;
        tag: string;
        image?: string;
    };
    liked: boolean;
    likeCount: number;
}

export async function getPosts(): Promise<PopulatedPost[]> {
    await connectMongoDB();
    const session = await getRawSession();
    const userId = session?.userId;

    const rawPosts = await Post.find()
        .populate("author", "name tag image")
        .sort({ createdAt: -1 })
        .lean();

    const typedPosts = rawPosts as unknown as PostWithPopulatedAuthor[];

    const postIds = typedPosts.map((post) => post._id);

    const likes = await Like.find({ post: { $in: postIds } }).lean();

    const likeCounts = new Map<string, number>();
    const likedPostIds = new Set<string>();

    likes.forEach((like) => {
        const pid = like.post.toString();
        likeCounts.set(pid, (likeCounts.get(pid) || 0) + 1);
        if (like.user.toString() === userId) {
            likedPostIds.add(pid);
        }
    });

    return typedPosts.map((post) => ({
        _id: post._id.toString(),
        title: post.title,
        body: post.body,
        image: post.image,
        createdAt: post.createdAt.toISOString(),
        author: {
            _id: post.author._id.toString(),
            name: post.author.name,
            tag: post.author.tag,
            image: post.author.image,
        },
        liked: likedPostIds.has(post._id.toString()),
        likeCount: likeCounts.get(post._id.toString()) || 0,
    }));
}

export async function getPostById(postId: string): Promise<PopulatedPost | null> {
    await connectMongoDB();

    const session = await getRawSession();
    const userId = session?.userId;

    const rawPost = await Post
        .findById(postId)
        .populate('author', 'name tag image')
        .lean<PostWithPopulatedAuthor | null>();

    if (!rawPost) return null;

    const [likeCount, userLiked] = await Promise.all([
        Like.countDocuments({ post: rawPost._id }),
        userId
            ? Like.exists({ post: rawPost._id, user: new Types.ObjectId(userId) })
            : Promise.resolve(false)
    ]);

    return {
        _id: rawPost._id.toString(),
        title: rawPost.title,
        body: rawPost.body,
        image: rawPost.image,
        createdAt: rawPost.createdAt.toISOString(),
        author: {
            _id: rawPost.author._id.toString(),
            name: rawPost.author.name,
            tag: rawPost.author.tag,
            image: rawPost.author.image,
        },
        liked: Boolean(userLiked),
        likeCount,
    };
}