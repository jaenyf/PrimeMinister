import { isMouseOnNode, isMouseOnEdge } from "../rendering/hit-test.js";
import { zoomAt } from "../rendering/zoom.js";
import { centerGraph } from "../rendering/center.js";
import { GraphKind } from "../core/state.js";

export function setupEventHandlers(app) {
    // Resize
    if (app.ui.canvas) {
        app.ui.canvas.width = window.innerWidth;
        app.ui.canvas.height = window.innerHeight;
    }

    // setupEventHandlers
    // Schedule redraw
    function scheduleRedraw(graphChanged = false) {
        app.graphState.needsRedraw = true;
        if (graphChanged) app.graphState.graphDirty = true;
    }

    // Buttons
    app.ui.zoomInBtn.onclick = () => {
        app.graphState.manualTransform = true;
        zoomAt(app.ui.canvas.width / 2, app.ui.canvas.height / 2, 1.1, app.graphState);
        scheduleRedraw();
    };

    app.ui.zoomOutBtn.onclick = () => {
        app.graphState.manualTransform = true;
        zoomAt(app.ui.canvas.width / 2, app.ui.canvas.height / 2, 1 / 1.1, app.graphState);
        scheduleRedraw();
    };

    app.ui.centerBtn.onclick = () => {
        app.graphState.manualTransform = false;
        centerGraph(app.ui.canvas, app.graphState);
        scheduleRedraw();
    };

    // Inputs
    app.ui.startInput.oninput = () => {
        app.graphState.graphStartValue = +app.ui.startInput.value;
        scheduleRedraw(true);
    }

    app.ui.endInput.oninput = () => {
        app.graphState.graphEndValue = +app.ui.endInput.value;
        scheduleRedraw(true);
    }

    app.ui.typeSelect.onchange = (e) => {
        switch (e.target.value) {
            case "Zero":
                app.graphState.graphKind = GraphKind.Zero;
                break;
            case "Odd":
                app.graphState.graphKind = GraphKind.Odd;
                break;
            case "Even":
                app.graphState.graphKind = GraphKind.Even;
                break;
            default:
                throw new Error("Unknown graph kind selected: " + e.target.value);
        }
        scheduleRedraw(true);
    }

    app.ui.startMultiplierBtn.onclick = () => {
        app.ui.startInput.value = +app.ui.startInput.value * 2;
        app.graphState.graphStartValue = +app.ui.startInput.value;
        scheduleRedraw(true);
    };

    app.ui.startDividerBtn.onclick = () => {
        app.ui.startInput.value = Math.floor(+app.ui.startInput.value / 2);
        app.graphState.graphStartValue = +app.ui.startInput.value;
        scheduleRedraw(true);
    };

    app.ui.endMultiplierBtn.onclick = () => {
        app.ui.endInput.value = +app.ui.endInput.value * 2;
        app.graphState.graphEndValue = +app.ui.endInput.value;
        scheduleRedraw(true);
    };

    app.ui.endDividerBtn.onclick = () => {
        app.ui.endInput.value = Math.floor(+app.ui.endInput.value / 2);
        app.graphState.graphEndValue = +app.ui.endInput.value;
        scheduleRedraw(true);
    };

    app.ui.nodesDisplayTypeSelect.onchange = (e) => {
        app.graphState.nodesDisplayType = e.target.value;
        scheduleRedraw(true);
    };
    app.ui.edgesDisplayTypeSelect.onchange = (e) => {
        app.graphState.edgesDisplayType = e.target.value;
        scheduleRedraw(true);
    };

    // Mouse events
    app.ui.canvas.onmousedown = (e) => {
        app.graphState.isPanning = true;
        app.graphState.panXStart = (e.clientX - app.graphState.panX) / app.graphState.zoom;
        app.graphState.panYStart = (e.clientY - app.graphState.panY) / app.graphState.zoom;
    };

    app.ui.canvas.onmouseup = () => app.graphState.isPanning = false;

    app.ui.canvas.onmousemove = (e) => {
        const mx = (e.clientX - app.graphState.panX) / app.graphState.zoom;
        const my = (e.clientY - app.graphState.panY) / app.graphState.zoom;

        if (app.graphState.isPanning) {
            app.graphState.panX = e.clientX - app.graphState.panXStart * app.graphState.zoom;
            app.graphState.panY = e.clientY - app.graphState.panYStart * app.graphState.zoom;
            app.graphState.manualTransform = true;
            scheduleRedraw();
        }

        let hoveredNode = null;
        for (let node of app.graphState.nodes) {
            if (isMouseOnNode(mx, my, node, app.graphState)) {
                hoveredNode = node;
            }
        }

        if (hoveredNode) {
            if (app.ui.tooltip) {
                app.ui.tooltip.style.left = `${e.clientX + 10}px`;
                app.ui.tooltip.style.top = `${e.clientY + 10}px`;
                app.ui.tooltip.innerHTML = `${hoveredNode.value} = ${hoveredNode.primesFactors.map(p => `${p.value}<sup>${p.power}</sup>`).join(" × ")}`;
                app.ui.tooltip.classList.toggle("primes", hoveredNode.isPrime);
                app.ui.tooltip.style.display = "block";
            }
        } else {
            if (app.ui.tooltip) app.ui.tooltip.style.display = "none";
        }

        if (!hoveredNode) {
            let hoveredEdge = null;
            for (let edge of app.graphState.edges) {
                if (isMouseOnEdge(mx, my, edge, app.graphState)) {
                    hoveredEdge = edge;
                    break;
                }
            }
            if (hoveredEdge) {
                if (app.ui.tooltip) {
                    app.ui.tooltip.style.left = `${e.clientX + 10}px`;
                    app.ui.tooltip.style.top = `${e.clientY + 10}px`;
                    app.ui.tooltip.innerHTML = `${hoveredEdge.from.value} &rarr; ${hoveredEdge.to.value}`;
                    app.ui.tooltip.classList.toggle("primes", hoveredEdge.from.isPrime && hoveredEdge.to.isPrime);
                    app.ui.tooltip.style.display = "block";
                }
            } else {
                if (app.ui.tooltip) tooltip.style.display = "none";
            }
        }
    };

    app.ui.canvas.onwheel = (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        app.graphState.manualTransform = true;
        zoomAt(e.clientX, e.clientY, factor, app.graphState);
        scheduleRedraw();
    };

    app.ui.canvas.oncontextmenu = (e) => e.preventDefault();

    window.onresize = () => {
        app.ui.canvas.width = window.innerWidth;
        app.ui.canvas.height = window.innerHeight;
        scheduleRedraw(true);
    }

    app.ui.showSymmetryLineCheckbox.onchange = (e) => {
        app.graphState.showLineOfSymmetry = e.target.checked;
        scheduleRedraw(true);
    }
}
