import { createGraphState } from "../../src/core/state.js";
import { setupEventHandlers } from "../../src/ui/events.js";
import { queryUIMock } from "../mocks/ui-mock.js";

describe("events", () => {
    it("handles wheel zoom", () => {
        const state = createGraphState();
        const mockedUi = queryUIMock(state);
        mockedUi.canvas.width = 800;
        mockedUi.canvas.height = 600;
        setupEventHandlers(mockedUi, state);

        mockedUi.canvas.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));

        expect(state.zoom).toBeGreaterThan(1);
    });
});


describe("events", () => {
    it("mouse move when not panning does not schedule redrawn", () => {
        const state = createGraphState();
        const mockedUi = queryUIMock(state);
        mockedUi.canvas.width = 800;
        mockedUi.canvas.height = 600;
        setupEventHandlers(mockedUi, state);
        state.needsRedraw = false;

        mockedUi.canvas.dispatchEvent(new MouseEvent("mousemove"));

        expect(state.needsRedraw).toBe(false);
    });
});

describe("events", () => {
    it("mouse move when panning does schedule redrawn", () => {
        const state = createGraphState();
        const mockedUi = queryUIMock(state);
        mockedUi.canvas.width = 800;
        mockedUi.canvas.height = 600;
        setupEventHandlers(mockedUi, state);
        state.needsRedraw = false;
        state.isPanning = true;

        mockedUi.canvas.dispatchEvent(new MouseEvent("mousemove"));

        expect(state.needsRedraw).toBe(true);
    });
});