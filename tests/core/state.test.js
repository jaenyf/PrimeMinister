import { createGraphState } from "../../src/core/state.js";

describe("createGraphState", () => {
    it("creates state with required default properties", () => {
        const state = createGraphState();
        expect(state).toHaveProperty("graphKind");
        expect(state).toHaveProperty("graphStartValue");
        expect(state).toHaveProperty("graphEndValue");
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
