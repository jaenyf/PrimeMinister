export function isMouseOnNode(mx, my, node, graphState) {
    return _isMouseOnCircle(mx, my, node.x, node.y, graphState.nodeRadius, graphState.zoom);
}

export function isMouseOnEdge(mx, my, edge, graphState) {
    return _isMouseOnLine(mx, my, edge.from.x, edge.from.y, edge.to.x, edge.to.y, graphState.zoom);
}

function _isMouseOnCircle(mx, my, cx, cy, radius, zoom) {
    // Adjust the radius according to the zoom factor
    const zoomedRadius = radius * zoom;

    // Calculate the distance from the mouse position to the center of the circle
    const dx = mx - cx;
    const dy = my - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the distance is less than or equal to the radius
    return distance <= zoomedRadius;
}

function _isMouseOnLine(mx, my, x1, y1, x2, y2, zoom) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (!lenSq) return false;

    const t = ((mx - x1) * dx + (my - y1) * dy) / lenSq;
    if (t < 0 || t > 1) return false;

    const lx = x1 + t * dx;
    const ly = y1 + t * dy;

    const dist = Math.hypot(mx - lx, my - ly);
    return dist < 5 / zoom;
}
