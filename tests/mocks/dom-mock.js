import { createMockCanvas } from "./canvas-mock.js";

export function installMockDOM() {
    const graphCanvasMock = createMockCanvas();

    // Keep references to the real DOM helpers so tests can still set
    // `document.body.innerHTML` or load `index.html` and rely on real
    // elements when present. Fall back to lightweight mocks when an
    // element is missing from the jsdom document.
    const realGetElementById = globalThis.document.getElementById.bind(globalThis.document);
    globalThis.document.getElementById = (id) => {
        const real = realGetElementById(id);
        if (real) return real;

        if (id === "graphCanvas") {
            return graphCanvasMock;
        }

        // If a test asks for other ids, return null rather than throwing
        // so that tests that only care about a subset of elements are
        // not brittle.
        return null;
    }

    const realCreateElement = globalThis.document.createElement.bind(globalThis.document);
    globalThis.document.createElement = (tagName) => {
        if (tagName.toLowerCase() === "canvas") {
            return createMockCanvas();
        }
        return realCreateElement(tagName);
    }
}
