import { isMouseOnLine } from "../rendering/hit-test.js";
import { zoomAt } from "../rendering/zoom.js";
import { centerGraph } from "../rendering/center.js";
import { GraphKind } from "../core/state.js";

export function setupEventHandlers(ui, graphState) {
    const {
        canvas, tooltip,
        startInput, endInput, typeSelect,
        nodesDisplayTypeSelect, edgesDisplayTypeSelect,
        zoomInBtn, zoomOutBtn, centerBtn,
        startMultiplierBtn, startDividerBtn, endMultiplierBtn, endDividerBtn
    } = ui;

    // Resize
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // setupEventHandlers
    // Schedule redraw
    function scheduleRedraw(graphChanged = false) {
        graphState.needsRedraw = true;
        if (graphChanged) graphState.graphDirty = true;
    }

    // Buttons
    zoomInBtn.onclick = () => {
        graphState.manualTransform = true;
        zoomAt(canvas.width / 2, canvas.height / 2, 1.1, graphState);
        scheduleRedraw();
    };

    zoomOutBtn.onclick = () => {
        graphState.manualTransform = true;
        zoomAt(canvas.width / 2, canvas.height / 2, 1 / 1.1, graphState);
        scheduleRedraw();
    };

    centerBtn.onclick = () => {
        graphState.manualTransform = false;
        centerGraph(canvas, graphState);
        scheduleRedraw();
    };

    // Inputs
    startInput.oninput = () => {
        graphState.graphStartValue = +startInput.value;
        scheduleRedraw(true);
    }

    endInput.oninput = () => {
        graphState.graphEndValue = +endInput.value;
        scheduleRedraw(true);
    }

    typeSelect.onchange = (e) => {
        switch (e.target.value) {
            case "Zero":
                graphState.graphKind = GraphKind.Zero;
                break;
            case "Odd":
                graphState.graphKind = GraphKind.Odd;
                break;
            case "Even":
                graphState.graphKind = GraphKind.Even;
                break;
            default:
                throw new Error("Unknown graph kind selected: " + e.target.value);
        }
        scheduleRedraw(true);
    }

    startMultiplierBtn.onclick = () => {
        startInput.value = +startInput.value * 2;
        graphState.graphStartValue = +startInput.value;
        scheduleRedraw(true);
    };

    startDividerBtn.onclick = () => {
        startInput.value = Math.floor(+startInput.value / 2);
        graphState.graphStartValue = +startInput.value;
        scheduleRedraw(true);
    };

    endMultiplierBtn.onclick = () => {
        endInput.value = +endInput.value * 2;
        graphState.graphEndValue = +endInput.value;
        scheduleRedraw(true);
    };

    endDividerBtn.onclick = () => {
        endInput.value = Math.floor(+endInput.value / 2);
        graphState.graphEndValue = +endInput.value;
        scheduleRedraw(true);
    };

    nodesDisplayTypeSelect.onchange = (e) => {
        graphState.nodesDisplayType = e.target.value;
        scheduleRedraw(true);
    };
    edgesDisplayTypeSelect.onchange = (e) => {
        graphState.edgesDisplayType = e.target.value;
        scheduleRedraw(true);
    };

    // Mouse events
    canvas.onmousedown = (e) => {
        graphState.isPanning = true;
        graphState.panXStart = (e.clientX - graphState.panX) / graphState.zoom;
        graphState.panYStart = (e.clientY - graphState.panY) / graphState.zoom;
    };

    canvas.onmouseup = () => graphState.isPanning = false;

    canvas.onmousemove = (e) => {
        const mx = (e.clientX - graphState.panX) / graphState.zoom;
        const my = (e.clientY - graphState.panY) / graphState.zoom;

        if (graphState.isPanning) {
            graphState.panX = e.clientX - graphState.panXStart * graphState.zoom;
            graphState.panY = e.clientY - graphState.panYStart * graphState.zoom;
            graphState.manualTransform = true;
        }

        let hovered = null;
        for (let edge of graphState.edges) {
            if (isMouseOnLine(mx, my, edge.from.x, edge.from.y, edge.to.x, edge.to.y, graphState.zoom)) {
                hovered = edge;
                break;
            }
        }

        if (hovered) {
            if (tooltip) {
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.top = `${e.clientY + 10}px`;
                tooltip.innerText = `${hovered.from.value} → ${hovered.to.value}`;
                tooltip.classList.toggle("primes", hovered.from.isPrime && hovered.to.isPrime);
                tooltip.style.display = "block";
            }
        } else {
            if (tooltip) tooltip.style.display = "none";
        }

        scheduleRedraw();
    };

    canvas.onwheel = (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        graphState.manualTransform = true;
        zoomAt(e.clientX, e.clientY, factor, graphState);
        scheduleRedraw();
    };

    canvas.oncontextmenu = (e) => e.preventDefault();

    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        scheduleRedraw(true);
    }
}
