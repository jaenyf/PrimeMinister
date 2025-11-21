import { generateGraph } from "../../src/core/graph-generator.js";
import { createGraphState, GraphKind } from "../../src/core/state.js";
import { queryUIMock } from "../mocks/ui-mock.js";

describe.each([{
    graphKind: GraphKind.Odd, expectedNodes: 5, expectedEdges: 4
},
{
    graphKind: GraphKind.Even, expectedNodes: 4, expectedEdges: 3
},
{
    graphKind: GraphKind.Zero, expectedNodes: 6, expectedEdges: 5
}
])("generateGraph", ({ graphKind, expectedNodes, expectedEdges }) => {
    it("creates nodes and edges", () => {
        // Arrange
        const state = createGraphState();
        const mockedUi = queryUIMock(state);
        state.graphStartValue = 1;
        state.graphEndValue = 5;
        state.graphKind = graphKind;

        // Act
        generateGraph(mockedUi.canvas, state);

        // Assert
        expect(state.nodes.length).toBe(expectedNodes);
        expect(state.edges.length).toBe(expectedEdges);
        expect(state.nodes[0].children.length).toBeGreaterThan(0);
    });
});
