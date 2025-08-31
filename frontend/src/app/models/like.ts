import { Schema, model, models, Types } from "mongoose";

export interface ILike extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
    },
    { timestamps: true }
);

likeSchema.index({ user: 1, post: 1 }, { unique: true });

const Like = models?.Like || model<ILike>("Like", likeSchema);
export default Like;