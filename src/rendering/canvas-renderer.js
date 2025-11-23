let _cachedCanvas = _initializeCachedCanvas();
let _cachedVisibleArea = { left: 0, top: 0, right: 0, bottom: 0 };
let _redrawInProgress = false;

function _initializeCachedCanvas() {
    const cnv = document.createElement("canvas");
    return cnv;
}

export function resetCanvasCache() {
    _cachedVisibleArea = { left: 0, top: 0, right: 0, bottom: 0 }
    _redrawInProgress = false;
}

function _shouldRefreshCache(viewport) {
    const c = _cachedVisibleArea;
    const EPS = 0.5; // tolerance
    return (
        Math.abs(c.left - viewport.left) > EPS ||
        Math.abs(c.right - viewport.right) > EPS ||
        Math.abs(c.top - viewport.top) > EPS ||
        Math.abs(c.bottom - viewport.bottom) > EPS
    );
}

// Entry point to draw the graph
export function drawGraph(ctx, canvas, graphState) {
    // Only redraw the graph if it's not cached or zoom doesn't match
    const viewport = graphState.getVisibleArea(canvas);
    if (_shouldRefreshCache(viewport)) {

        if (_cachedCanvas.width !== canvas.width || _cachedCanvas.height !== canvas.height) {
            // Ensure cachedCanvas has correct dimensions
            _cachedCanvas.width = canvas.width;
            _cachedCanvas.height = canvas.height;
        }

        // Start the background redraw process if it's not already in progress
        if (!_redrawInProgress) {
            _redrawInProgress = true;
            _redrawGraphAsync(ctx, canvas, graphState, viewport);
        }
    } else {
        // If everything is ready, use the cached image
        _swapBuffer(canvas, ctx, graphState);
    }
}

// Swap the cached canvas onto the visible canvas with current pan/zoom
function _swapBuffer(canvas, ctx, graphState) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(_cachedCanvas, 0, 0);
}

let _currentFrameId = 0;

function _redrawGraphAsync(ctx, canvas, graphState, viewport) {
    const frameId = ++_currentFrameId;

    // Create a new offscreen canvas to hold the redrawn graph
    const cachedCanvas = _initializeCachedCanvas();
    cachedCanvas.width = canvas.width;
    cachedCanvas.height = canvas.height;

    // Redraw the graph at the new zoom level asynchronously
    requestAnimationFrame(() => {
        // Ignore old frames
        if (frameId !== _currentFrameId) return;

        _drawGraphToCanvas(cachedCanvas.getContext("2d"), cachedCanvas, graphState, viewport);

        // Once the graph is ready, update the cache
        _cachedCanvas = cachedCanvas;
        _cachedVisibleArea = { ...viewport };
        _redrawInProgress = false;

        // Draw the updated cached canvas onto the visible canvas
        _swapBuffer(canvas, ctx, graphState);
    });
}

function _drawGraphToCanvas(context, canvas, graphState, visibleArea) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Line of symmetry
    if (graphState.showLineOfSymmetry && graphState.nodes.length > 0) {
        const lineX = (graphState.nodes[0].x - visibleArea.left) * graphState.zoom;
        context.beginPath();
        context.moveTo(lineX, 0);
        context.lineTo(lineX, canvas.height);
        context.strokeStyle = "#888";
        context.lineWidth = 1;
        context.setLineDash([5, 5]);
        context.stroke();
        context.setLineDash([]);
    }

    // Edges
    for (let edge of graphState.edges) {
        if (!_isEdgeInArea(edge, visibleArea)) continue;

        const bothPrime = edge.from.isPrime && edge.to.isPrime;
        if (graphState.edgesDisplayType === 'Primes' && !bothPrime) continue;
        if (graphState.edgesDisplayType === 'NonPrimes' && bothPrime) continue;
        if (graphState.edgesDisplayType === 'None') continue;

        context.beginPath();
        context.moveTo((edge.from.x - visibleArea.left) * graphState.zoom, (edge.from.y - visibleArea.top) * graphState.zoom);
        context.lineTo((edge.to.x - visibleArea.left) * graphState.zoom, (edge.to.y - visibleArea.top) * graphState.zoom);
        context.strokeStyle = bothPrime ? "#f80" : "#000";
        context.lineWidth = 2;
        context.stroke();
    }

    // Nodes
    for (let node of graphState.nodes) {
        if (!_isNodeInArea(node, visibleArea, graphState)) continue;
        if (graphState.nodesDisplayType === 'Primes' && !node.isPrime) continue;
        if (graphState.nodesDisplayType === 'NonPrimes' && node.isPrime) continue;
        if (graphState.nodesDisplayType === 'None') continue;

        const nodeX = (node.x - visibleArea.left) * graphState.zoom;
        const nodeY = (node.y - visibleArea.top) * graphState.zoom;

        context.beginPath();
        context.arc(nodeX, nodeY, graphState.nodeRadius, 0, Math.PI * 2); // fixed radius
        context.fillStyle = node.isPrime ? "#f80" : "#08f";
        context.fill();

        context.fillStyle = "white";
        context.font = "12px Arial";
        context.fillText(node.value, nodeX - graphState.nodeRadius / 2, nodeY + 5);
    }
}

// check whether a given edge is in a given area
function _isEdgeInArea(edge, viewport) {
    const x1 = edge.from.x;
    const y1 = edge.from.y;
    const x2 = edge.to.x;
    const y2 = edge.to.y;

    // Check if either node is inside
    if (
        (x1 >= viewport.left && x1 <= viewport.right && y1 >= viewport.top && y1 <= viewport.bottom) ||
        (x2 >= viewport.left && x2 <= viewport.right && y2 >= viewport.top && y2 <= viewport.bottom)
    ) return true;

    // Quick rejection: both nodes completely outside on the same side
    if ((x1 < viewport.left && x2 < viewport.left) ||
        (x1 > viewport.right && x2 > viewport.right) ||
        (y1 < viewport.top && y2 < viewport.top) ||
        (y1 > viewport.bottom && y2 > viewport.bottom)) return false;

    // Otherwise, check intersection with each viewport edge
    const rectEdges = [
        { x1: viewport.left, y1: viewport.top, x2: viewport.right, y2: viewport.top },     // top
        { x1: viewport.right, y1: viewport.top, x2: viewport.right, y2: viewport.bottom }, // right
        { x1: viewport.right, y1: viewport.bottom, x2: viewport.left, y2: viewport.bottom }, // bottom
        { x1: viewport.left, y1: viewport.bottom, x2: viewport.left, y2: viewport.top }   // left
    ];

    for (const re of rectEdges) {
        if (_segmentsIntersect(x1, y1, x2, y2, re.x1, re.y1, re.x2, re.y2)) return true;
    }

    return false;
}

// Utility: check if two segments intersect
function _segmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    function ccw(ax, ay, bx, by, cx, cy) {
        return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
    }
    return (ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4)) &&
        (ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4));
}

// check whether a given node is in a given area
function _isNodeInArea(node, viewport, graphState) {
    const pad = graphState.nodeRadius;

    return (
        node.x >= viewport.left - pad &&
        node.x <= viewport.right + pad &&
        node.y >= viewport.top - pad &&
        node.y <= viewport.bottom + pad
    );
}


// Returns the node under the given mouse coordinates (canvas pixels)
export function getNodeAt(mouseX, mouseY, canvas, graphState) {
    const viewport = graphState.getVisibleArea(canvas);
    for (let node of graphState.nodes) {
        if (!_isNodeInArea(node, viewport, graphState)) continue;

        // Convert world coordinates to screen coordinates
        const nodeScreenX = (node.x - viewport.left) * graphState.zoom;
        const nodeScreenY = (node.y - viewport.top) * graphState.zoom;

        const dx = mouseX - nodeScreenX;
        const dy = mouseY - nodeScreenY;

        if (Math.sqrt(dx * dx + dy * dy) <= graphState.nodeRadius) {
            return node;
        }
    }
    return null;
}

// Returns the edge under the given mouse coordinates (canvas pixels)
export function getEdgeAt(mouseX, mouseY, canvas, graphState) {
    const viewport = graphState.getVisibleArea(canvas);
    for (let edge of graphState.edges) {
        if (!_isEdgeInArea(edge, viewport)) continue;

        const x1 = (edge.from.x - viewport.left) * graphState.zoom;
        const y1 = (edge.from.y - viewport.top) * graphState.zoom;
        const x2 = (edge.to.x - viewport.left) * graphState.zoom;
        const y2 = (edge.to.y - viewport.top) * graphState.zoom;

        // Distance from point to line segment
        const dist = _pointToSegmentDistance(mouseX, mouseY, x1, y1, x2, y2);
        if (dist <= 5) { // 5px tolerance
            return edge;
        }
    }
    return null;
}

// Utility: distance from point (px, py) to segment (x1, y1)-(x2, y2)
function _pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}
