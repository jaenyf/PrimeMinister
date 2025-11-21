import { precomputePrimes, checkIsPrime } from "./prime-utils.js";
import { arrangeNodes } from "./layout.js";
import { GraphKind } from "./state.js";

function computeRoot(start, graphKind) {
    switch (graphKind) {
        case GraphKind.Zero: return start > 2 ? start : 0;
        case GraphKind.Odd: return start % 2 === 0 ? (start > 1 ? start - 1 : 1) : start;
        case GraphKind.Even:
            return start % 2 === 0
                ? (start > 1 ? start : 2)
                : (start - 1 > 1 ? start - 1 : 2);
        default:
            throw new Error("Unknown graph kind: " + graphKind);
    }
}

export function generateGraph(canvas, graphState) {
    graphState.nodes.length = 0;
    graphState.edges.length = 0;

    const rootValue = computeRoot(graphState.graphStartValue, graphState.graphKind);
    precomputePrimes(rootValue, graphState.graphEndValue);

    const createNode = (value) => ({
        value,
        children: [],
        parent: null,
        x: 0,
        y: 0,
        isPrime: checkIsPrime(value),
    });

    const valid = [];
    for (let i = rootValue; i <= graphState.graphEndValue; i++) valid.push(i);

    const root = createNode(rootValue);
    graphState.nodes.push(root);

    let level = [root];

    for (let i = 1; i < valid.length; i++) {
        const node = createNode(valid[i]);
        graphState.nodes.push(node);

        const parent = level.find(n => n.children.length < 2);
        if (parent) {
            parent.children.push(node);
            node.parent = parent;
            graphState.edges.push({ from: parent, to: node });
            level.push(node);
        }
    }

    arrangeNodes(canvas, graphState);
}
