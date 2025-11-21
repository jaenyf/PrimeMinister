import { createGraphState } from "../../src/core/state.js";
import { zoomAt } from "../../src/rendering/zoom.js";

describe.each([
    { factor: 1, expected: 0.5 },
    { factor: 2, expected: 1 },
    { factor: 3, expected: 1.5 }
])("zoomAt $a", ({ factor, expected }) => {
    it("applies zoom", () => {
        // Arrange
        const state = createGraphState();
        state.zoom = 0.5;
        const mouseX = 200;
        const mouseY = 150;

        // Act
        zoomAt(mouseX, mouseY, factor, state);

        // Assert
        expect(state.zoom).toBe(expected);
    });
});
