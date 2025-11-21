import { createGraphState } from "../../src/core/state.js";
import { arrangeNodes } from "../../src/core/layout.js";
import { queryUIMock } from "../mocks/ui-mock.js";

describe("arrangeNodes", () => {
    it("assigns x/y coordinates to nodes", () => {
        const state = createGraphState();
        const mockedUi = queryUIMock(state);
        state.nodes = [
            { value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [] }] }
        ];

        arrangeNodes(mockedUi.canvas, state);

        for (const n of state.nodes) {
            expect(typeof n.x).toBe("number");
            expect(typeof n.y).toBe("number");
        }
    });
});
