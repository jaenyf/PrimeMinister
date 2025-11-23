import { setupEventHandlers } from "./ui/events.js";
import { generateGraph } from "./core/graph-generator.js";
import { drawGraph, resetCanvasCache } from "./rendering/canvas-renderer.js";
import { centerGraph } from "./rendering/center.js";
import { createApp } from "./core/app.js";
import { queryUI } from "./ui/dom.js"

// Render Loop
function renderLoop(app) {
    if (app.graphState.needsRedraw) {
        if (app.graphState.graphDirty) {
            generateGraph(app.ui.canvas, app.graphState);
            resetCanvasCache();

            if (!app.graphState.manualTransform) centerGraph(app.ui.canvas, app.graphState);

            app.graphState.graphDirty = false;
        }

        drawGraph(app.ui.ctx, app.ui.canvas, app.graphState);
        app.graphState.needsRedraw = false;
    }
    requestAnimationFrame(() => renderLoop(app));
}

const app = createApp(queryUI());
setupEventHandlers(app);
renderLoop(app);
