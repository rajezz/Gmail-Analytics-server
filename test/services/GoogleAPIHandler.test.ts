import { describe } from "@jest/globals";
// import { stub } from "sinon";

import { GoogleAPIHandler } from "../../src/services/GoogleAPIHandler";

describe("Method: getAccessToken", () => {
    it("should return the access token", () => {
        // const accessToken = getAccessToken()
    });
});

describe("GoogleAPIHandler > get", () => {
    it("should fail since accessToken in not provided", async () => {
        const url = "https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=500";
        const [error] = await new GoogleAPIHandler("invalidtoken").get(url);
        expect(error.code).toBe(401);
        expect(error.status).toBe("UNAUTHENTICATED");
    });
});
