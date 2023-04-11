import logger from "../lib/logger";
import util from "util";
import qs from "querystring";

import { FetchAPI, PostAPI } from "../lib/axios";
import { GOOGLE_OAUTH_TOKEN_URL } from "../_data/urls";
import { getBodyForToken } from "../lib/utils";
import { AxiosResponse } from "axios";
import { HttpStatus } from "../lib/HttpStatus";

const ServerErrorResponse = {
    code: 500,
    message: "Something went wrong",
    status: "SERVER_ERROR",
};
const AuthenticationErrorResponse = {
    code: 401,
    message: "Not Authenticated",
    status: "UNAUTHENTICATED",
};

function handleAPIError(response: AxiosResponse<any>) {
    logger.error(`ERRSOURCE: Google API | ${response.config.method} | ${response.config.url}`);
    logger.error(`ERRBODY: ${util.inspect(response.data, true, 3, true)}`);
    return [response.data?.error || ServerErrorResponse, null];
}

export interface IGoogleAPIHandler {
    refreshToken: string;
    accessToken?: string;
    getHeaders: () => object;
    setToken: () => Promise<any[]>;
    get: (url: string) => Promise<any[]>;
    post: (url: string, body: any) => Promise<void>;
}

export class GoogleAPIHandler implements IGoogleAPIHandler {
    accessToken: string | undefined;
    refreshToken: string;
    getHeaders() {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.accessToken}`,
            },
        };
    }

    constructor(refreshToken: string) {
        this.refreshToken = refreshToken;
    }

    async setToken() {
        const [error, response] = await PostAPI(
            GOOGLE_OAUTH_TOKEN_URL,
            qs.stringify(getBodyForToken(this.refreshToken))
        );

        if (error) {
            logger.info("Received error instance");
            return handleAPIError(error.response);
        }
        if (response.status != HttpStatus.OK) {
            logger.info("Received response instance");
            return handleAPIError(response);
        }

        logger.debug(
            `Successfully got access token: ${util.inspect(response?.data, false, 3, true)}`
        );
        this.accessToken = response.data.access_token;
        return [null];
    }
    async get(url: string) {
        if (typeof this.accessToken === "undefined") {
            return [AuthenticationErrorResponse];
        }

        const [error, response] = await FetchAPI(url, this.getHeaders());

        if (error) {
            logger.info("Received error instance");
            return handleAPIError(error.response);
        }
        if (response.status != HttpStatus.OK) {
            logger.info("Received response instance");
            return handleAPIError(response);
        }

        logger.debug(`SUCCESS | Gmail threads: ${util.inspect(response.data, false, 3, true)}`);
        return [null, response.data];
    }
    async post(url: string, body: any) {
        throw new Error("Not implemented");
    }
}

// export async function getAccessToken(refreshToken: string): Promise<any[]> {
//     const [error, response] = await PostAPI(
//         GOOGLE_OAUTH_TOKEN_URL,
//         qs.stringify(getBodyForToken(refreshToken))
//     );

//     if (error) {
//         logger.info("Received error instance");
//         return handleAPIError(error.response);
//     }
//     if (response.status != HttpStatus.OK) {
//         logger.info("Received response instance");
//         return handleAPIError(response);
//     }

//     logger.debug(`Successfully got access token: ${util.inspect(response?.data, false, 3, true)}`);
//     return [null, response.data.access_token];
// }

// export async function Get(accessToken: string, pageToken: NullableType<string> = null) {}

// export async function getThreads(accessToken: string, pageToken: NullableType<string> = null) {
//     const url = `${GOOGLE_THREADS_URL}?maxResults=500${pageToken ? `&pageToken=${pageToken}` : ``}`;
//     const [error, response] = await FetchAPI(url, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });

//     if (error) {
//         logger.info("Received error instance");
//         return handleAPIError(error.response);
//     }
//     if (response.status != HttpStatus.OK) {
//         logger.info("Received response instance");
//         return handleAPIError(response);
//     }

//     logger.debug(`SUCCESS | Gmail threads: ${util.inspect(response.data, false, 3, true)}`);
//     return [null, response.data];
// }
