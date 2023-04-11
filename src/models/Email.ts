import { Schema, model } from "mongoose";

import { incrementEmailCount } from "../services/MongoProviders/Import";

export interface EmailDocument {
    googleId: string;
    threadId: string;
    threadHistoryId: string;
    from: string;
    to: string;
    subject?: string;
    date: Schema.Types.Date;
}

const EmailSchema = new Schema<EmailDocument>({
    googleId: { type: Schema.Types.String, required: true },
    threadId: { type: Schema.Types.String, required: true, unique: true },
    threadHistoryId: { type: Schema.Types.String, required: true },
    from: { type: Schema.Types.String, required: true },
    to: { type: Schema.Types.String, required: true },
    subject: { type: Schema.Types.String },
    date: { type: Schema.Types.Date, required: true },
});

export const Email = model<EmailDocument>("Email", EmailSchema);

EmailSchema.pre("save", async function (next) {
    await incrementEmailCount("importedEmailCount", this.googleId, 1);
    next();
});