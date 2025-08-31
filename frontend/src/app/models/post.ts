import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IPost extends Document {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    title: string | null;
    body: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: false,
        },
        body: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Post = (mongoose.models.Post as Model<IPost>) ||
    mongoose.model<IPost>("Post", postSchema);

export default Post;
