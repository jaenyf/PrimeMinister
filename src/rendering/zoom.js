export function zoomAt(mouseX, mouseY, factor, graphState) {
    const cursorX = (mouseX - graphState.panX) / graphState.zoom;
    const cursorY = (mouseY - graphState.panY) / graphState.zoom;

    graphState.zoom *= factor;

    graphState.panX = mouseX - cursorX * graphState.zoom;
    graphState.panY = mouseY - cursorY * graphState.zoom;
}
