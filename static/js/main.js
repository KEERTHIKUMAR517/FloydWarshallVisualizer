let defaultNumNodes = 4; // By default start with 4 nodes
let numNodes = defaultNumNodes;
let nodes = [];
let edges = [];
let isDragging = false;
let dragStartNode = null;
let mouseX = 0, mouseY = 0;

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

const finalCanvas = document.getElementById('finalGraphCanvas');
const fctx = finalCanvas.getContext('2d');

const createNodesBtn = document.getElementById('createNodesBtn');
const computeBtn = document.getElementById('computeBtn');
const queryBtn = document.getElementById('queryBtn');
const addNodeBtn = document.getElementById('addNodeBtn');
const removeNodeBtn = document.getElementById('removeNodeBtn');
const refreshBtn = document.getElementById('refreshBtn');

createNodesBtn.addEventListener('click', createNodes);
computeBtn.addEventListener('click', computeShortestPaths);
queryBtn.addEventListener('click', queryShortestPath);
addNodeBtn.addEventListener('click', addNode);
removeNodeBtn.addEventListener('click', removeNode);
refreshBtn.addEventListener('click', refreshAll);

document.getElementById('numNodes').addEventListener('change', (e) => {
  numNodes = parseInt(e.target.value, 10);
});

let nodeRadius = 10;          

function createNodes() {
  nodes = [];
  edges = [];

  // Dynamically set the node spacing radius based on canvas size
  let nodeSpacingRadius = (Math.min(canvas.width, canvas.height) / 2) - 50;

  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  for (let i = 0; i < numNodes; i++) {
    let angle = (2 * Math.PI * i) / numNodes;
    let x = centerX + nodeSpacingRadius * Math.cos(angle);
    let y = centerY + nodeSpacingRadius * Math.sin(angle);
    nodes.push({ label: String.fromCharCode(65 + i), x: x, y: y });
  }
  draw();
  clearMatrices();
  document.getElementById('canvas-container-final').style.display = 'none';
}

function refreshAll() {
  numNodes = defaultNumNodes;
  document.getElementById('numNodes').value = defaultNumNodes;
  createNodes();
  document.getElementById('negativeEdgeWarning').style.display = 'none';
  document.getElementById('negativeCycleWarning').style.display = 'none';
  document.getElementById('queryResult').innerHTML = '';
}

canvas.addEventListener('mousedown', (e) => {
  let pos = getMousePos(canvas, e);
  let clickedNode = getNodeAtPos(pos.x, pos.y);
  if (clickedNode) {
    isDragging = true;
    dragStartNode = clickedNode;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && dragStartNode) {
    let pos = getMousePos(canvas, e);
    mouseX = pos.x;
    mouseY = pos.y;
    draw();
    ctx.strokeStyle = '#ff5050';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dragStartNode.x, dragStartNode.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (isDragging && dragStartNode) {
    let pos = getMousePos(canvas, e);
    let dropNode = getNodeAtPos(pos.x, pos.y);
    if (dropNode && dropNode !== dragStartNode) {
      let weight = prompt(`Enter weight for edge ${dragStartNode.label} -> ${dropNode.label}`, "1");
      if (weight !== null && weight.trim() !== '') {
        let w = parseFloat(weight);
        edges.push({ source: dragStartNode.label, target: dropNode.label, weight: w });
        // Removed the immediate warning display:
        // if (w < 0) {
        //   document.getElementById('negativeEdgeWarning').style.display = 'block';
        // }
      }
    }
  }
  isDragging = false;
  dragStartNode = null;
  draw();
  clearMatrices();
});

function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getNodeAtPos(x, y) {
  for (let n of nodes) {
    let dx = n.x - x;
    let dy = n.y - y;
    if ((dx*dx + dy*dy) <= nodeRadius*nodeRadius) {
      return n;
    }
  }
  return null;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  ctx.strokeStyle = '#333';
  ctx.fillStyle = '#333';
  ctx.lineWidth = 2;

  for (let e of edges) {
    let fromNode = nodes.find(n => n.label === e.source);
    let toNode = nodes.find(n => n.label === e.target);
    drawArrow(ctx, fromNode, toNode, e.weight);
  }

  drawNodes(ctx, nodes);
}

function drawArrow(context, fromNode, toNode, weight) {
  let headlen = 10;
  let dx = toNode.x - fromNode.x;
  let dy = toNode.y - fromNode.y;
  let angle = Math.atan2(dy, dx);
  let startX = fromNode.x + nodeRadius * Math.cos(angle);
  let startY = fromNode.y + nodeRadius * Math.sin(angle);
  let endX = toNode.x - nodeRadius * Math.cos(angle);
  let endY = toNode.y - nodeRadius * Math.sin(angle);

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();

  context.beginPath();
  context.moveTo(endX, endY);
  context.lineTo(endX - headlen * Math.cos(angle - Math.PI/6),
                 endY - headlen * Math.sin(angle - Math.PI/6));
  context.lineTo(endX - headlen * Math.cos(angle + Math.PI/6),
                 endY - headlen * Math.sin(angle + Math.PI/6));
  context.lineTo(endX, endY);
  context.fill();

  let oldFillStyle = context.fillStyle;
  context.fillStyle = '#ff0000';
  context.font = "bold 12px Segoe UI"; 
  let midX = (startX + endX)/2;
  let midY = (startY + endY)/2;
  context.fillText(weight, midX, midY - 5);
  context.fillStyle = oldFillStyle;
  context.font = "16px Segoe UI";
}

function drawNodes(context, nodeArray) {
  for (let n of nodeArray) {
    let gradient = context.createRadialGradient(n.x, n.y, nodeRadius*0.2, n.x, n.y, nodeRadius);
    gradient.addColorStop(0, "#4a90e2");
    gradient.addColorStop(1, "#357ab7");

    context.beginPath();
    context.arc(n.x, n.y, nodeRadius, 0, 2 * Math.PI);
    context.shadowColor = "rgba(0,0,0,0.2)";
    context.shadowBlur = 3;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;

    context.fillStyle = gradient;
    context.fill();
    context.shadowBlur = 0;
    context.lineWidth = 1;
    context.strokeStyle = '#fff';
    context.stroke();
    context.fillStyle = '#fff';
    context.font = "12px Segoe UI";
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(n.label, n.x, n.y);
  }
}

function computeShortestPaths() {
  const payload = {
    num_nodes: numNodes,
    edges: edges
  };

  fetch('/compute', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    const matrix = data.distance_matrix;
    const nextMatrix = data.next_matrix;

    showAdjacencyMatrix();
    showDistanceMatrix(matrix);
    showPathMatrix(nextMatrix);

    // Show warnings based on the compute response only
    document.getElementById('negativeEdgeWarning').style.display = data.negative_edge_warning ? 'block' : 'none';
    document.getElementById('negativeCycleWarning').style.display = data.negative_cycle ? 'block' : 'none';

    document.getElementById('canvas-container-final').style.display = 'block';
    drawFinalGraph(matrix, nextMatrix);
  });
}

function showDistanceMatrix(matrix) {
  const table = document.getElementById('distanceMatrix');
  table.innerHTML = '';
  let headerRow = document.createElement('tr');
  let emptyCell = document.createElement('th');
  emptyCell.innerHTML = '';
  headerRow.appendChild(emptyCell);

  for (let i = 0; i < numNodes; i++) {
    let th = document.createElement('th');
    th.innerHTML = String.fromCharCode(65+i);
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let i = 0; i < numNodes; i++) {
    let row = document.createElement('tr');
    let rowHeader = document.createElement('th');
    rowHeader.innerHTML = String.fromCharCode(65+i);
    row.appendChild(rowHeader);
    for (let j = 0; j < numNodes; j++) {
      let td = document.createElement('td');
      td.innerHTML = matrix[i][j];
      row.appendChild(td);
    }
    table.appendChild(row);
  }
}

function showAdjacencyMatrix() {
  let adj = [];
  for (let i = 0; i < numNodes; i++) {
    let row = [];
    for (let j = 0; j < numNodes; j++) {
      if (i === j) {
        row.push(0);
      } else {
        let edge = edges.find(e => e.source === String.fromCharCode(65+i) && e.target === String.fromCharCode(65+j));
        row.push(edge ? edge.weight : "∞");
      }
    }
    adj.push(row);
  }

  const table = document.getElementById('adjacencyMatrix');
  table.innerHTML = '';
  let headerRow = document.createElement('tr');
  let emptyCell = document.createElement('th');
  emptyCell.innerHTML = '';
  headerRow.appendChild(emptyCell);

  for (let i = 0; i < numNodes; i++) {
    let th = document.createElement('th');
    th.innerHTML = String.fromCharCode(65+i);
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let i = 0; i < numNodes; i++) {
    let rowEl = document.createElement('tr');
    let rowHeader = document.createElement('th');
    rowHeader.innerHTML = String.fromCharCode(65+i);
    rowEl.appendChild(rowHeader);
    for (let j = 0; j < numNodes; j++) {
      let td = document.createElement('td');
      td.innerHTML = adj[i][j];
      rowEl.appendChild(td);
    }
    table.appendChild(rowEl);
  }
}

function showPathMatrix(nextMatrix) {
  const table = document.getElementById('pathMatrix');
  table.innerHTML = '';
  let headerRow = document.createElement('tr');
  let emptyCell = document.createElement('th');
  emptyCell.innerHTML = '';
  headerRow.appendChild(emptyCell);

  for (let i = 0; i < numNodes; i++) {
    let th = document.createElement('th');
    th.innerHTML = String.fromCharCode(65+i);
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let i = 0; i < numNodes; i++) {
    let row = document.createElement('tr');
    let rowHeader = document.createElement('th');
    rowHeader.innerHTML = String.fromCharCode(65+i);
    row.appendChild(rowHeader);
    for (let j = 0; j < numNodes; j++) {
      let td = document.createElement('td');
      td.innerHTML = nextMatrix[i][j];
      row.appendChild(td);
    }
    table.appendChild(row);
  }
}

function drawFinalGraph(matrix, nextMatrix) {
  fctx.clearRect(0,0,finalCanvas.width,finalCanvas.height);

  let nodeMap = {};
  for (let n of nodes) {
    nodeMap[n.label] = n;
  }

  let shortestPathEdges = [];
  for (let i = 0; i < numNodes; i++) {
    for (let j = 0; j < numNodes; j++) {
      if (i != j && nextMatrix[i][j] !== '∞') {
        let startLabel = String.fromCharCode(65+i);
        let nextLabel = nextMatrix[i][j];
        if (nextLabel !== '∞') {
          shortestPathEdges.push({ source: startLabel, target: nextLabel });
        }
      }
    }
  }

  fctx.strokeStyle = '#333';
  fctx.fillStyle = '#333';
  fctx.lineWidth = 2;

  for (let e of shortestPathEdges) {
    let fromNode = nodeMap[e.source];
    let toNode = nodeMap[e.target];
    let w = getEdgeWeight(e.source, e.target) || '?';
    drawArrow(fctx, fromNode, toNode, w);
  }

  drawNodes(fctx, nodes);
}

function queryShortestPath() {
  let start = document.getElementById('startNode').value.toUpperCase();
  let end = document.getElementById('endNode').value.toUpperCase();

  const payload = {
    num_nodes: numNodes,
    edges: edges,
    start: start,
    end: end
  };

  fetch('/shortest_path_query', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    const queryResult = document.getElementById('queryResult');
    if (!data.path || data.path.length === 0) {
      queryResult.innerHTML = "No path found.";
    } else {
      queryResult.innerHTML = `Shortest path: ${data.path.join(' -> ')} (Distance: ${data.distance})`;
      highlightPath(data.path);
    }
  });
}

function highlightPath(path) {
  draw();
  ctx.strokeStyle = 'purple';
  ctx.fillStyle = 'purple';
  ctx.lineWidth = 3;
  
  for (let i=0; i < path.length-1; i++) {
    let fromNode = nodes.find(n => n.label === path[i]);
    let toNode = nodes.find(n => n.label === path[i+1]);
    if (fromNode && toNode) {
      drawArrow(ctx, fromNode, toNode, getEdgeWeight(fromNode.label, toNode.label));
    }
  }

  ctx.lineWidth = 1;
}

function getEdgeWeight(u, v) {
  for (let e of edges) {
    if (e.source === u && e.target === v) return e.weight;
  }
  return null;
}

function addNode() {
  numNodes++;
  let nodeSpacingRadius = (Math.min(canvas.width, canvas.height) / 2) - 50;
  let angle = (2 * Math.PI * (numNodes-1)) / numNodes;
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  let x = centerX + nodeSpacingRadius * Math.cos(angle);
  let y = centerY + nodeSpacingRadius * Math.sin(angle);
  let labelInput = document.getElementById('addNodeLabel').value.trim();
  let label = labelInput ? labelInput.toUpperCase() : String.fromCharCode(65 + (numNodes-1));
  
  if (nodes.find(n => n.label === label)) {
    alert("Node with this label already exists. Choose another label.");
    numNodes--;
    return;
  }

  nodes.push({ label: label, x: x, y: y });
  draw();
  clearMatrices();
}

function removeNode() {
  const nodeToRemove = document.getElementById('removeNodeInput').value.toUpperCase();
  if (!nodeToRemove) return;

  let targetNodeIndex = nodes.findIndex(n => n.label === nodeToRemove);
  if (targetNodeIndex === -1) {
    alert("Node does not exist.");
    return;
  }

  nodes.splice(targetNodeIndex, 1);
  edges = edges.filter(e => e.source !== nodeToRemove && e.target !== nodeToRemove);
  draw();
  clearMatrices();
}

function clearMatrices() {
  document.getElementById('adjacencyMatrix').innerHTML = '';
  document.getElementById('distanceMatrix').innerHTML = '';
  document.getElementById('pathMatrix').innerHTML = '';
}

// Initialize with default nodes = 4
createNodes();
