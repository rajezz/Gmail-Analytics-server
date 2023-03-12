import { model, Schema } from "mongoose";
import { UserDocument } from "../types/user";

const UserSchema = new Schema<UserDocument>({
    name: { type: "string", required: true },
    email: { type: "string", required: true, unique: true },
    picture: { type: "string" },
    googleId: { type: "string", required: true, unique: true },
    refreshToken: { type: "string", required: true },
    apiKey: { type: "string", required: false },
    scopePref: { type: "string", required: true },
});

export const User = model<UserDocument>("User", UserSchema);
