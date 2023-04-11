// import util from "util";
// import logger from "./logger";

export function asyncWrapper(method: any): Promise<any> {
    return new Promise((resolve) => {
        method
            .then((res: PromiseFulfilledResult<any>) => resolve([null, res]))
            .catch((err: PromiseRejectedResult) => resolve([err, null]));
    });
}

export const getBodyForToken = (refresh_token: string) => ({
    refresh_token,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token",
});

export const getGoogleAPIOption = (accessToken: string) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    },
});

export const trimObject = (obj: any, keys: Array<string>): any => {
    // logger.debug(`obj: ${util.inspect(obj, false, 3, true)}`);
    // logger.debug(`keys: ${util.inspect(keys, false, 3, true)}`);
    return keys.reduce(
        (acc, key) => ({
            ...acc,
            ...(typeof obj[key] != "undefined" ? { [key]: obj[key] } : {}),
        }),
        {}
    );
};
