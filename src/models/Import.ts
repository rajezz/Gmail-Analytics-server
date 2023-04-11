import { Schema, model } from "mongoose";

type IJobState =
    | "NEW"
    | "FETCHING_THREADLISTS"
    | "FETCHING_THREADS"
    | "TERMINATED"
    | "FAILED";

export interface ImportDocument {
    googleId: string;
    status?: IJobState;
    grossEmailCount?: number;
    importedEmailCount?: number;
}

const ImportSchema = new Schema<ImportDocument>(
    {
        googleId: { type: Schema.Types.String, required: true },
        status: { type: "string", default: "NEW" },
        grossEmailCount: { type: Schema.Types.Number, default: 0 },
        importedEmailCount: { type: Schema.Types.Number, default:0}
    },
    { timestamps: true }
);

export const Import = model<ImportDocument>("Import", ImportSchema);
