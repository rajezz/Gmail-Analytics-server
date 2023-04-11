import { describe, expect } from "@jest/globals";

import { trimObject } from "../../src/lib/utils";

describe("trimObject", () => {
    const inputObj = {
        _id: "sampleid",
        googleId: "0123456789",
        __v: 0,
        email: "test@domain.com",
        picture: "picturelink",
        name: "Test user",
        refreshToken: "refreshtoken",
        scopePref: "all",
    };
    const expectedObj = {
        googleId: "0123456789",
        email: "test@domain.com",
        picture: "picturelink",
        name: "Test user",
        refreshToken: "refreshtoken",
        scopePref: "all",
    };
    const inputKeys = ["name", "email", "picture", "googleId", "refreshToken", "scopePref"];
    it("should trim object", () => {
        expect(trimObject(inputObj, inputKeys)).toStrictEqual(expectedObj);
    });
});
