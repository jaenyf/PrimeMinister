import { generateGraph } from "../../src/core/graph-generator.js";
import { createTestState } from "../mocks/state-mock.js";

describe.each([{
    graphType: "odd", expectedNodes: 5, expectedEdges: 4
},
{
    graphType: "even", expectedNodes: 4, expectedEdges: 3
},
{
    graphType: "zero", expectedNodes: 6, expectedEdges: 5
}
])("generateGraph", ({ graphType, expectedNodes, expectedEdges }) => {
    it("creates nodes and edges", () => {
        // Arrange
        const state = createTestState();

        // Act
        generateGraph(1, 5, graphType);

        // Assert
        expect(state.nodes.length).toBe(expectedNodes);
        expect(state.edges.length).toBe(expectedEdges);
        expect(state.nodes[0].children.length).toBeGreaterThan(0);
    });
});
