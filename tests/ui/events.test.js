import { createTestState } from "../mocks/state-mock.js";
import { setupEventHandlers } from "../../src/ui/events.js";

describe("events", () => {
    it("handles wheel zoom", () => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;

        document.body.append(canvas);

        const state = createTestState();
        setupEventHandlers(canvas, state);

        canvas.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));

        expect(state.zoom).toBeGreaterThan(1);
    });
});
