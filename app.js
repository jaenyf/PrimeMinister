const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const startInput = document.getElementById('start');
const endInput = document.getElementById('end');
const typeSelect = document.getElementById('type');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');

let nodes = [];
let edges = [];
let zoom = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panXStart = 0, panYStart = 0;
let manualTransform = false;    // indicates whether the user has zoomed or panned
let nodeRadius = 20;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Check if a number is prime
function isPrime(num) {
    if (num < 2) return num == 1 ? true : false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Calculates the root according to the selected type
function computeRoot(start, type) {
    if (type.toLowerCase() === "zero") {
        return start;
    } else if (type.toLowerCase() === "odd") {
        return start % 2 === 0 ? start + 1 : start;
    } else if (type.toLowerCase() === "even") {
        return start % 2 === 0 ? start : start + 1;
    }
    return start;
}

// Generate the graph
function generateGraph(start, end, type) {
    nodes = [];
    edges = [];
    const validNumbers = [];

    const rootValue = computeRoot(start, type);

    for (let i = rootValue; i <= end; i++) {
        validNumbers.push(i);
    }

    const createNode = (value) => ({
        value: value,
        children: [],
        parent: null,
        x: 0,
        y: 0,
        isPrime: isPrime(value),
    });

    const rootNode = createNode(rootValue);
    nodes.push(rootNode);
    let currentLevel = [rootNode];

    validNumbers.slice(1).forEach((num) => {
        const node = createNode(num);
        nodes.push(node);

        let parent = currentLevel.find(n => n.children.length < 2);
        if (parent) {
            parent.children.push(node);
            node.parent = parent;
            edges.push({ from: parent, to: node });
        }

        if (node.parent) {
            currentLevel.push(node);
        }
    });

    arrangeNodes(start, end);
}


// Node positioning (adaptation according to the start-end range)
function arrangeNodes(start, end) {
    if (nodes.length === 0) return;

    const V_MARGIN = 50; // vertical margin
    const H_MARGIN = 50; // horizontal margin
    let xPos = H_MARGIN;

    // 1) Calculation of maximum depth
    function getDepth(node) {
        if (node.children.length === 0) return 1;
        return 1 + Math.max(...node.children.map(getDepth));
    }
    const maxDepth = getDepth(nodes[0]);

    // 2) Vertical position
    function setY(node, level = 0) {
        node.y = V_MARGIN + level * ((canvas.height - 2 * V_MARGIN) / (maxDepth - 1));
        node.children.forEach(child => setY(child, level + 1));
    }
    setY(nodes[0]);

    // 3) Horizontal position (parent focused on their children)
    function arrangeNode(node, level = 0) {
        if (node.children.length === 0) {
            node.x = xPos;
            xPos += 60; // minimum horizontal spacing between sheets
        } else {
            node.children.forEach(child => arrangeNode(child, level + 1));
            const firstChild = node.children[0];
            const lastChild = node.children[node.children.length - 1];
            node.x = (firstChild.x + lastChild.x) / 2; // center the parent
        }
    }
    arrangeNode(nodes[0]);

    // 4) Adjust horizontally to use all available space
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const scaleX = (canvas.width - 2 * H_MARGIN) / (maxX - minX || 1);
    nodes.forEach(n => {
        n.x = H_MARGIN + (n.x - minX) * scaleX;
    });
}




// Graph drawing
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Drawing edges
    edges.forEach(edge => {
        const edgeColor = '#000';

        ctx.beginPath();
        ctx.moveTo(edge.from.x * zoom + panX, edge.from.y * zoom + panY);
        ctx.lineTo(edge.to.x * zoom + panX, edge.to.y * zoom + panY);
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Drawing nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x * zoom + panX, node.y * zoom + panY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.isPrime ? '#f80' : '#08f';
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(node.value, node.x * zoom + panX - nodeRadius / 2, node.y * zoom + panY + 5);
    });
}

// Center graph without drawing
function centerGraphWithoutDrawing() {
    if (!nodes || nodes.length === 0) return;

    //1) Global bounding box 
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxY = Math.max(...nodes.map(n => n.y));
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    // 2) Maximum zoom for using canvas
    const zoomHeight = (canvas.height / graphHeight) * 0.95;
    const zoomWidth = (canvas.width / graphWidth) * 0.95;
    const newZoom = Math.min(zoomHeight, zoomWidth);

    // 3) Horizontal centering based on parents 
    const parentNodes = nodes.filter(n => n.children && n.children.length > 0);
    const minParentX = Math.min(...parentNodes.map(n => n.x));
    const maxParentX = Math.max(...parentNodes.map(n => n.x));
    const parentCenterX = (minParentX + maxParentX) / 2;

    let newPanX = (canvas.width / 2) - parentCenterX * newZoom;

    // 4) Conventional vertical centering
    const newPanY = (canvas.height - graphHeight * newZoom) / 2 - minY * newZoom;

    // 5) Horizontal adjustment if sheets protrude
    const leafNodes = nodes.filter(n => !n.children || n.children.length === 0);
    const minLeafX = Math.min(...leafNodes.map(n => n.x)) * newZoom + newPanX;
    const maxLeafX = Math.max(...leafNodes.map(n => n.x)) * newZoom + newPanX;

    // 6) Offset if leaves extend beyond the canvas
    if (minLeafX < 0) newPanX += -minLeafX + 10;  // 10px de marge
    if (maxLeafX > canvas.width) newPanX -= (maxLeafX - canvas.width) + 10;

    // 7) Apply transformations
    zoom = newZoom;
    panX = newPanX;
    panY = newPanY;
}



// Zooming in
function zoomIn() {
    let zoomFactor = 1.1;
    zoom *= zoomFactor;
    drawGraph();
}

// Zooming out
function zoomOut() {
    let zoomFactor = 1.1;
    zoom /= zoomFactor;
    drawGraph();
}

// Zoom and center button events
zoomInBtn.addEventListener('click', () => {
    manualTransform = true;
    zoomIn();
});
zoomOutBtn.addEventListener('click', () => {
    manualTransform = true;
    zoomOut();
});
//  Zoom with mouse wheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    manualTransform = true; // User has manually zoomed

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate the cursor position in relative coordinates
    const cursorX = (mouseX - panX) / zoom;
    const cursorY = (mouseY - panY) / zoom;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1; // Facteur de zoom

    // Adjust the zoom
    zoom *= zoomFactor;

    // Adjust panX and panY according to the zoom change
    panX = mouseX - cursorX * zoom;
    panY = mouseY - cursorY * zoom;

    drawGraph();
});
canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        panX = e.clientX - panXStart * zoom;
        panY = e.clientY - panYStart * zoom;
        manualTransform = true; // User has manually panned
    }
    drawGraph();
});

canvas.addEventListener('mouseup', () => {
    isPanning = false;
});
canvas.addEventListener('mousedown', (e) => {
    const mouseX = (e.clientX - panX) / zoom;
    const mouseY = (e.clientY - panY) / zoom;

    panXStart = mouseX;
    panYStart = mouseY;
    isPanning = true;
});


startInput.addEventListener('input', () => refreshGraph());
endInput.addEventListener('input', () => refreshGraph());
typeSelect.addEventListener('change', () => refreshGraph());

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

function refreshGraph() {
    const start = parseInt(startInput.value);
    const end = parseInt(endInput.value);
    const type = typeSelect.value;
    generateGraph(start, end, type);
    if (!manualTransform) {
        centerGraphWithoutDrawing();
    }
    drawGraph();
}

// Initial generation
refreshGraph();
