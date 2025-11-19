import { state } from "./state.js";

export function arrangeNodes() {
    const canvas = document.getElementById("graphCanvas");
    if (!state.nodes.length) return;

    const V_MARGIN = 50, H_MARGIN = 50;
    const levels = [];

    const root = state.nodes[0];
    root.level = 0;

    const queue = [root];
    while (queue.length) {
        const node = queue.shift();
        if (!levels[node.level]) levels[node.level] = [];
        levels[node.level].push(node);

        for (let c of node.children) {
            c.level = node.level + 1;
            queue.push(c);
        }
    }

    const maxDepth = Math.max(levels.length, 2);
    levels.forEach((levelNodes, i) => {
        const y = V_MARGIN + i * ((canvas.height - 2 * V_MARGIN) / (maxDepth - 1));
        levelNodes.forEach(n => n.y = y);
    });

    let nextX = H_MARGIN;
    function assignX(node) {
        if (!node.children.length) {
            node.x = nextX;
            nextX += 60;
        } else {
            node.children.forEach(assignX);
            const first = node.children[0].x;
            const last = node.children[node.children.length - 1].x;
            node.x = (first + last) / 2;
        }
    }
    assignX(root);

    const xs = state.nodes.map(n => n.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const scaleX = (canvas.width - 2 * H_MARGIN) / (maxX - minX || 1);

    state.nodes.forEach(n =>
        n.x = H_MARGIN + (n.x - minX) * scaleX
    );
}
