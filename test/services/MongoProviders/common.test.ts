import { describe } from "@jest/globals";

import { findByQuery } from "../../../src/services/MongoProviders/common";
import { Import, ImportDocument } from "../../../src/models/Import";

describe("findByQuery", () => {
    jest.setTimeout(20000);
    it("should fail", async () => {
        const googleId = "101290517566467262909";
        const [error, response] = await findByQuery<ImportDocument>(Import, { googleId });
        console.log(error.name);
        console.log(error.message);
        console.log(response);
        // expect(error.code).toBe(401);
        // expect(error.status).toBe("UNAUTHENTICATED");
    });
});
