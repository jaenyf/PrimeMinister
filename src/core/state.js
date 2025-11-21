// Defines the different kinds of graphs that can be generated
export const GraphKind = {
    Zero: Symbol("GraphKind.Zero"),
    Odd: Symbol("GraphKind.Odd"),
    Even: Symbol("GraphKind.Even"),
};
Object.freeze(GraphKind);

// Creates and returns a new state object for the app
export function createGraphState() {
    return {
        graphKind: GraphKind.Zero,
        graphStartValue: 0,
        graphEndValue: 0,
        nodes: [],
        edges: [],
        zoom: 1,
        panX: 0,
        panY: 0,
        panXStart: 0,
        panYStart: 0,
        isPanning: false,
        manualTransform: false,
        nodeRadius: 20,
        nodesDisplayType: 'All',
        edgesDisplayType: 'All',
        needsRedraw: true,
        graphDirty: true
    };
}
