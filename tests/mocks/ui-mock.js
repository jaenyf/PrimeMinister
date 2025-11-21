import { createMockCanvas } from "./canvas-mock.js";
// import { queryUI } from "../../src/ui/dom.js";

export function queryUIMock(graphState) {
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

    //const ui = queryUI(graphState);

    const uiObj = {
        canvas: graphCanvasMock,
        ctx: graphCanvasMock.getContext ? graphCanvasMock.getContext("2d") : null,
        tooltip: null,
        startInput: { value: "", oninput: null },
        endInput: { value: "", oninput: null },
        typeSelect: { value: "", onchange: null },
        nodesDisplayTypeSelect: { onchange: null },
        edgesDisplayTypeSelect: { onchange: null },
        zoomInBtn: { onclick: null },
        zoomOutBtn: { onclick: null },
        centerBtn: { onclick: null },
        startMultiplierBtn: { onclick: null },
        startDividerBtn: { onclick: null },
        endMultiplierBtn: { onclick: null },
        endDividerBtn: { onclick: null }
    };

    //ui.canvas = graphCanvasMock;

    return uiObj;
}
