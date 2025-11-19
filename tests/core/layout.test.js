import { createTestState, nodes } from "../mocks/state-mock.js";
import { arrangeNodes } from "../../src/core/layout.js";

describe("arrangeNodes", () => {
    it("assigns x/y coordinates to nodes", () => {
        const state = createTestState();
        state.nodes = [
            { value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [] }] }
        ];

        arrangeNodes();

        for (const n of state.nodes) {
            expect(typeof n.x).toBe("number");
            expect(typeof n.y).toBe("number");
        }
    });
});
