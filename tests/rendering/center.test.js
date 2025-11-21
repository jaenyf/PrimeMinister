import { centerGraph } from "../../src/rendering/center.js";
import { createMockCanvas } from "../mocks/canvas-mock.js";
import { createGraphState } from "../../src/core/state.js";

describe("centerGraph", () => {
    it("computes pan and zoom", () => {
        // Arrange
        const state = createGraphState();
        state.zoom = 0;
        state.nodes = [
            { x: 0, y: 0 },
            { x: 100, y: 100 },
            { x: 50, y: 50 }
        ];
        const canvas = createMockCanvas();

        // Act
        centerGraph(canvas, state);

        // Assert
        expect(state.zoom).toBeGreaterThan(0);
        expect(state.panX).toBeGreaterThan(0);
        expect(state.panY).toBeGreaterThan(0);
    });
});
