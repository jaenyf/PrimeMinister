let cachedCanvas = null;
let cachedZoom = 1;

export function resetCanvasCache() {
    cachedCanvas = null;
    cachedZoom = 0;     // force redraw
}

export function drawGraph(ctx, canvas, graphState) {
    if (!cachedCanvas || cachedZoom !== graphState.zoom) {
        cachedCanvas = document.createElement("canvas");
        cachedCanvas.width = canvas.width;
        cachedCanvas.height = canvas.height;

        const cctx = cachedCanvas.getContext("2d");
        cctx.clearRect(0, 0, canvas.width, canvas.height);

        // Edges
        for (let e of graphState.edges) {
            const bothPrime = e.from.isPrime && e.to.isPrime;

            if (graphState.edgesDisplayType === 'Primes' && !bothPrime) continue;
            if (graphState.edgesDisplayType === 'NonPrimes' && bothPrime) continue;
            if (graphState.edgesDisplayType === 'None') continue;

            cctx.beginPath();
            cctx.moveTo(e.from.x, e.from.y);
            cctx.lineTo(e.to.x, e.to.y);
            cctx.strokeStyle = bothPrime ? "#f80" : "#000";
            cctx.lineWidth = 2;
            cctx.stroke();
        }

        // Nodes
        for (let node of graphState.nodes) {
            if (graphState.nodesDisplayType === 'Primes' && !node.isPrime) continue;
            if (graphState.nodesDisplayType === 'NonPrimes' && node.isPrime) continue;
            if (graphState.nodesDisplayType === 'None') continue;

            cctx.beginPath();
            cctx.arc(node.x, node.y, graphState.nodeRadius, 0, Math.PI * 2);
            cctx.fillStyle = node.isPrime ? "#f80" : "#08f";
            cctx.fill();

            cctx.fillStyle = "white";
            cctx.font = "12px Arial";
            cctx.fillText(node.value, node.x - graphState.nodeRadius / 2, node.y + 5);
        }

        cachedZoom = graphState.zoom;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        cachedCanvas,
        graphState.panX,
        graphState.panY,
        cachedCanvas.width * graphState.zoom,
        cachedCanvas.height * graphState.zoom
    );
}
