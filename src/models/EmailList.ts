import { Schema, model } from "mongoose";

import { incrementEmailCount } from "../services/MongoProviders/Import";

interface ThreadDocument {
    id: string;
}

const ThreadSchema = new Schema<ThreadDocument>({
    id: { type: "String", required: true },
});

export interface EmailListDocument {
    googleId: string;
    pageToken?: string;
    threads: ThreadDocument[];
}

const EmailListSchema = new Schema<EmailListDocument>(
    {
        googleId: { type: Schema.Types.String, required: true },
        pageToken: { type: Schema.Types.String, required: false },
        threads: [ThreadSchema],
    },
    { timestamps: true }
);

export const EmailList = model<EmailListDocument>("EmailList", EmailListSchema);

EmailListSchema.pre("save", async function (next) {
    await incrementEmailCount("grossEmailCount", this.googleId, this.threads.length);
    next();
});
