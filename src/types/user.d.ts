import { ObjectId } from "mongoose";

export interface UserDocument {
    name: string;
    email: string;
    picture?: string;
    googleId: string;
    refreshToken: string;
    apiKey?: string;
    scopePref: string;
}
