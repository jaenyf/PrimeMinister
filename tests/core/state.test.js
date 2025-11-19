import { state } from "../../src/core/state.js";

describe("state", () => {
    it("has required default properties", () => {
        expect(state).toHaveProperty("zoom");
        expect(state).toHaveProperty("panX");
        expect(state).toHaveProperty("panY");
        expect(state).toHaveProperty("panXStart");
        expect(state).toHaveProperty("panYStart");
        expect(state).toHaveProperty("isPanning");
        expect(state).toHaveProperty("nodes");
        expect(state).toHaveProperty("edges");
    });
});
