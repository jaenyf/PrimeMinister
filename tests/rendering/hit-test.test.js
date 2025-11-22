import { isMouseOnEdge, isMouseOnNode } from "../../src/rendering/hit-test.js";
import { createGraphState } from "../../src/core/state.js";

describe("isMouseOnEdge", () => {
    it("returns true when mouse is close to a segment", () => {
        const graphState = createGraphState();
        const edge = { from: { x: 0, y: 0 }, to: { x: 10, y: 10 } }
        const result = isMouseOnEdge(5, 5, edge, graphState);
        expect(result).toBe(true);
    });

    it("returns false when mouse X is far", () => {
        const graphState = createGraphState();
        const edge = { from: { x: 0, y: 0 }, to: { x: 10, y: 10 } }
        const result = isMouseOnEdge(100, 5, edge, graphState);
        expect(result).toBe(false);
    });

    it("returns false when mouse Y is far", () => {
        const graphState = createGraphState();
        const edge = { from: { x: 0, y: 0 }, to: { x: 10, y: 10 } }
        const result = isMouseOnEdge(5, 100, edge, graphState);
        expect(result).toBe(false);
    });
});

describe("isMouseOnNode", () => {
    it("returns true when mouse is on top of a node", () => {
        const graphState = createGraphState();
        const node = { x: 0, y: 0 };
        const result = isMouseOnNode(5, 5, node, graphState);
        expect(result).toBe(true);
    });

    it("returns false when mouse X is far", () => {
        const graphState = createGraphState();
        const node = { from: { x: 0, y: 0 }, to: { x: 10, y: 10 } }
        const result = isMouseOnNode(100, 5, node, graphState);
        expect(result).toBe(false);
    });

    it("returns false when mouse Y is far", () => {
        const graphState = createGraphState();
        const node = { from: { x: 0, y: 0 }, to: { x: 10, y: 10 } }
        const result = isMouseOnNode(5, 100, node, graphState);
        expect(result).toBe(false);
    });
});