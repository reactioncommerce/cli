import { expect } from "chai";
import ga4 from "../utils/ga4.js";

describe("ga pageview lib", () => {
  it("should send a pageview", async () => {
    const client = await ga4("clientId");
    const customDimensions = { cd1: "hello" };
    const response = await client.pageview("/thispage/thing", customDimensions);
    // eslint-disable-next-line jest/valid-expect
    expect(response).to.equal(null);
  });
});
