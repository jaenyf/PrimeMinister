import { createGraphState } from "../../src/core/state.js";
import { queryUI } from "../../src/ui/dom.js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { expect } from "vitest";

describe("dom bindings (index.html)", () => {
    it("loads index.html and extracts UI elements", () => {
        const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
        document.body.innerHTML = html;

        const state = createGraphState();
        const ui = queryUI(state);

        expect(ui).toBeDefined();
        expect(ui.canvas).toBeInstanceOf(HTMLCanvasElement);
        expect(ui.startInput).toBeInstanceOf(HTMLInputElement);
        expect(ui.endInput).toBeInstanceOf(HTMLInputElement);
        expect(ui.typeSelect).toBeInstanceOf(HTMLSelectElement);
        expect(ui.tooltip).toBeInstanceOf(HTMLElement);
        expect(ui.zoomInBtn).toBeInstanceOf(HTMLButtonElement);
        expect(ui.zoomOutBtn).toBeInstanceOf(HTMLButtonElement);
        expect(ui.centerBtn).toBeInstanceOf(HTMLButtonElement);
        // expect(ui.startMultiplierBtn).toBeInstanceOf(HTMLButtonElement);
        // expect(ui.startDividerBtn).toBeInstanceOf(HTMLButtonElement);
        // expect(ui.endMultiplierBtn).toBeInstanceOf(HTMLButtonElement);
        // expect(ui.endDividerBtn).toBeInstanceOf(HTMLButtonElement);
        expect(ui.nodesDisplayTypeSelect).toBeInstanceOf(HTMLSelectElement);
        expect(ui.edgesDisplayTypeSelect).toBeInstanceOf(HTMLSelectElement);
    });
});
