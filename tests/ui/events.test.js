import { createGraphState } from "../../src/core/state.js";
import { setupEventHandlers } from "../../src/ui/events.js";
import { queryUIMock } from "../mocks/ui-mock.js";
import { createApp } from "../../src/core/app.js";

describe("events", () => {
    it("handles wheel zoom", () => {
        const mockedUi = queryUIMock();
        mockedUi.canvas.width = 800;
        mockedUi.canvas.height = 600;
        const app = createApp(mockedUi);
        setupEventHandlers(app);

        mockedUi.canvas.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));

        expect(app.graphState.zoom).toBeGreaterThan(1);
    });
});


describe("events", () => {
    it("mouse move when not panning does not schedule redrawn", () => {
        const mockedUi = queryUIMock();
        mockedUi.canvas.width = 800;
        mockedUi.canvas.height = 600;
        const app = createApp(mockedUi);
        setupEventHandlers(app);
        app.graphState.needsRedraw = false;

        mockedUi.canvas.dispatchEvent(new MouseEvent("mousemove"));

        expect(app.graphState.needsRedraw).toBe(false);
    });
});

describe("events", () => {
    it("mouse move when panning does schedule redrawn", () => {
        const mockedUi = queryUIMock();
        mockedUi.canvas.width = 800;
        mockedUi.canvas.height = 600;
        const app = createApp(mockedUi);
        setupEventHandlers(app);
        app.graphState.needsRedraw = false;
        app.graphState.isPanning = true;

        mockedUi.canvas.dispatchEvent(new MouseEvent("mousemove"));

        expect(app.graphState.needsRedraw).toBe(true);
    });
});