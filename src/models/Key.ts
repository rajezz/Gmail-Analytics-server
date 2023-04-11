import { model, Schema } from "mongoose";

export interface KeyDocument {
    googleId: string;
    apiKey: string;
}

const KeySchema = new Schema<KeyDocument>(
    {
        googleId: { type: "string", required: true, unique: true },
        apiKey: { type: "string", required: true },
    },
    { timestamps: true }
);

export const Key = model<KeyDocument>("Key", KeySchema);
