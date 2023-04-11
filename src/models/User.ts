import { model, Schema } from "mongoose";

export interface UserDocument {
    name: string;
    email: string;
    picture?: string;
    googleId: string;
    refreshToken: string;
    scopePref: string;
}

const UserSchema = new Schema<UserDocument>(
    {
        name: { type: "string", required: true },
        email: { type: "string", required: true, unique: true },
        picture: { type: "string" },
        googleId: { type: "string", required: true, unique: true },
        refreshToken: { type: "string", required: true },
        scopePref: { type: "string", required: true },
    },
    { timestamps: true }
);

export const User = model<UserDocument>("User", UserSchema);
