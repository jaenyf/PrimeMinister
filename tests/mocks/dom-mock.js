import { createMockCanvas } from "./canvas-mock.js";

export function installMockDOM() {
    // jsdom already provides most of DOM
    globalThis.HTMLCanvasElement.prototype.getContext = function () {
        return {}; // replaced in test-specific mocks
    };

    // Minimal missing pieces
    globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);

    const graphCanvasMock = createMockCanvas();
    globalThis.document.getElementById = (id) => {
        if (id === "graphCanvas") {
            return graphCanvasMock;
        }
        throw new Error(`No mock for element with id "${id}"`);
    }
}
