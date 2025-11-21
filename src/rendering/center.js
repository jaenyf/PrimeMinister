export function centerGraph(canvas, graphState) {
    if (!graphState.nodes.length) return;

    const xs = graphState.nodes.map(n => n.x);
    const ys = graphState.nodes.map(n => n.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const gw = maxX - minX;
    const gh = maxY - minY;

    const zoomH = canvas.height / gh * 0.95;
    const zoomW = canvas.width / gw * 0.95;
    const newZoom = Math.min(zoomH, zoomW);

    graphState.zoom = newZoom;
    graphState.panX = (canvas.width - gw * newZoom) / 2 - minX * newZoom;
    graphState.panY = (canvas.height - gh * newZoom) / 2 - minY * newZoom;
}
