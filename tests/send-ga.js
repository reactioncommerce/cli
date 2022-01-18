import ga4 from "../utils/ga4.js";


describe("ga pageview lib", () => {
  it("should send a pageview", async () => {
    const client = await ga4("clientId");
    const customDimensions = { cd1: "hello" };
    await client.pageview("/thispage/thing", customDimensions);
  });
});
