export function createMockCanvas() {
    const context = createMockContext();
    const canvas = context.canvas;
    canvas.getContext = () => context;
    // Minimal EventTarget-like behavior for tests that dispatch events
    const listeners = {};
    canvas.addEventListener = (type, fn) => {
        listeners[type] = listeners[type] || [];
        listeners[type].push(fn);
    };
    canvas.removeEventListener = (type, fn) => {
        if (!listeners[type]) return;
        listeners[type] = listeners[type].filter(f => f !== fn);
    };
    canvas.dispatchEvent = (event) => {
        // call property handler first (e.g., canvas.onwheel)
        const propHandler = canvas[`on${event.type}`];
        if (typeof propHandler === 'function') propHandler(event);
        const fns = listeners[event.type] || [];
        for (const fn of fns) fn(event);
    };
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
