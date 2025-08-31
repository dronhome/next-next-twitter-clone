import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IUser extends Document {
    _id: Types.ObjectId;
    name?: string;
    tag?: string;
    email: string;
    password?: string;
    bio?: string;
    image?: string;
    image_key?: string;
    isOAuth: boolean;
    isProfileComplete: boolean;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, unique: true, sparse: true, required: false }, 
        tag: { type: String, unique: true, sparse: true, required: false },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: function (this: IUser) {
                return !this.isOAuth;
            },
        },
        bio: { type: String, default: "" },
        image: { type: String, default: "/generic-logo.png" },
        image_key: { type: String, default: "" },
        isOAuth: { type: Boolean, default: false },
        isProfileComplete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);

export default User;
