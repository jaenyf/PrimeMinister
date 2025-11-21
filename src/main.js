import { createGraphState } from "./core/state.js";
import { setupEventHandlers } from "./ui/events.js";
import { generateGraph } from "./core/graph-generator.js";
import { drawGraph, resetCanvasCache } from "./rendering/canvas-renderer.js";
import { centerGraph } from "./rendering/center.js";
import { queryUI } from "./ui/dom.js";

const graphState = createGraphState();
const ui = queryUI(graphState);

// Render Loop
function renderLoop(ui, graphState) {
    if (graphState.needsRedraw) {
        if (graphState.graphDirty) {
            generateGraph(ui.canvas, graphState);
            resetCanvasCache();

            if (!graphState.manualTransform) centerGraph(ui.canvas, graphState);

            graphState.graphDirty = false;
        }

        drawGraph(ui.ctx, ui.canvas, graphState);
        graphState.needsRedraw = false;
    }
    requestAnimationFrame(() => renderLoop(ui, graphState));
}

setupEventHandlers(ui, graphState);
renderLoop(ui, graphState);
