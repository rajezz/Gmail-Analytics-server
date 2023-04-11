import { EmailList, EmailListDocument } from "../../models/EmailList";
import { UserDocument } from "../../models/User";
import { findByQuery } from "./common";

export async function getPageToken(user: UserDocument) {
    const [error, response] = await findByQuery<EmailListDocument>(
        EmailList,
        {
            googleId: user.googleId,
        },
        { createdAt: -1 }
    );
    if (error) {
        return [error];
    }

    if (Array.isArray(response)) {
        return [null, response[0].pageToken];
    } else {
        return [null, response.pageToken];
    }
}
