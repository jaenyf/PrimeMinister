export function createMockCanvas() {
    const context = createMockContext();
    const canvas = context.canvas;
    canvas.getContext = () => context;
    return canvas;
}

export function createMockContext() {
    return {
        canvas: { width: 800, height: 600 },
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillText: vi.fn(),
        clearRect: vi.fn(),
        closePath: vi.fn(),

        drawImage: vi.fn(),

        strokeStyle: "",
        fillStyle: "",
        lineWidth: 0
    };
}
