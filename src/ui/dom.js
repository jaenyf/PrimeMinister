import { GraphKind } from "../core/state.js";

export function queryUI(graphSate) {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const ui = {
        canvas,
        ctx,
        tooltip: document.getElementById("tooltip"),
        startInput: document.getElementById("start"),
        endInput: document.getElementById("end"),
        typeSelect: document.getElementById("type"),

        nodesDisplayTypeSelect: document.getElementById("nodesDisplayType"),
        edgesDisplayTypeSelect: document.getElementById("edgesDisplayType"),

        zoomInBtn: document.getElementById("zoomInBtn"),
        zoomOutBtn: document.getElementById("zoomOutBtn"),
        centerBtn: document.getElementById("centerBtn"),

        startMultiplierBtn: document.getElementById("startMultiplierBtn"),
        startDividerBtn: document.getElementById("startDividerBtn"),
        endMultiplierBtn: document.getElementById("endMultiplierBtn"),
        endDividerBtn: document.getElementById("endDividerBtn")
    };

    graphSate.graphStartValue = parseInt(ui.startInput.value, 10) || 0;
    graphSate.graphEndValue = parseInt(ui.endInput.value, 10) || 0;
    graphSate.graphKind = (() => {
        switch (ui.typeSelect.value) {
            case "Zero": return GraphKind.Zero;
            case "Odd": return GraphKind.Odd;
            case "Even": return GraphKind.Even;
            default:
                throw new Error("Unknown graph kind selected: " + ui.typeSelect.value);
        }
    })();

    return ui;
}

export default queryUI;
