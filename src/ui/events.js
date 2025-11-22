import { isMouseOnNode, isMouseOnEdge } from "../rendering/hit-test.js";
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

        let hoveredNode = null;
        for (let node of graphState.nodes) {
            if (isMouseOnNode(mx, my, node, graphState)) {
                hoveredNode = node;
            }
        }

        if (hoveredNode) {
            if (tooltip) {
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.top = `${e.clientY + 10}px`;
                tooltip.innerHTML = `${hoveredNode.value} = ${hoveredNode.primesFactors.map(p => `${p.value}<sup>${p.power}</sup>`).join(" × ")}`;
                tooltip.classList.toggle("primes", hoveredNode.isPrime);
                tooltip.style.display = "block";
            }
        } else {
            if (tooltip) tooltip.style.display = "none";
        }

        if (!hoveredNode) {
            let hoveredEdge = null;
            for (let edge of graphState.edges) {
                if (isMouseOnEdge(mx, my, edge, graphState)) {
                    hoveredEdge = edge;
                    break;
                }
            }
            if (hoveredEdge) {
                if (tooltip) {
                    tooltip.style.left = `${e.clientX + 10}px`;
                    tooltip.style.top = `${e.clientY + 10}px`;
                    tooltip.innerText = `${hoveredEdge.from.value} → ${hoveredEdge.to.value}`;
                    tooltip.classList.toggle("primes", hoveredEdge.from.isPrime && hoveredEdge.to.isPrime);
                    tooltip.style.display = "block";
                }
            } else {
                if (tooltip) tooltip.style.display = "none";
            }
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

    ui.showSymmetryLineCheckbox.onchange = (e) => {
        graphState.showLineOfSymmetry = e.target.checked;
        scheduleRedraw(true);
    }
}
