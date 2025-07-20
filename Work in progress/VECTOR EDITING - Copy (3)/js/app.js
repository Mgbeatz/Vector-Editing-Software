let canvas = new fabric.Canvas('canvas', {
  width: 1000,
  height: 700,
  backgroundColor: '#fff',
});

let clipboard = null;
let activeTool = 'select';

// Update Layers Panel on object add/remove
canvas.on('object:added', () => updateLayers());
canvas.on('object:removed', () => updateLayers());

// Load saved project if available
window.addEventListener('load', () => {
  const saved = localStorage.getItem('vectorProject');
  if (saved) {
    canvas.loadFromJSON(saved, () => canvas.renderAll());
  }
});

// Grid overlay variables
let gridSize = 20;
let gridVisible = false;
let gridGroup = null;

function toggleGrid() {
  gridVisible = !gridVisible;

  if (gridGroup) {
    canvas.remove(gridGroup);
    gridGroup = null;
  }

  if (gridVisible) {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const lines = [];

    for (let i = 0; i < width; i += gridSize) {
      lines.push(new fabric.Line([i, 0, i, height], {
        stroke: '#ccc',
        selectable: false,
        evented: false,
        strokeWidth: 0.5
      }));
    }

    for (let i = 0; i < height; i += gridSize) {
      lines.push(new fabric.Line([0, i, width, i], {
        stroke: '#ccc',
        selectable: false,
        evented: false,
        strokeWidth: 0.5
      }));
    }

    gridGroup = new fabric.Group(lines, {
      selectable: false,
      evented: false,
      excludeFromExport: true
    });

    canvas.add(gridGroup);
    canvas.sendToBack(gridGroup);
  }

  canvas.requestRenderAll();
}

// Snap function for coordinates
function snapToGrid(value) {
  return Math.round(value / gridSize) * gridSize;
}

// Snap object moving and scaling to grid
canvas.on('object:moving', (e) => {
  if (!gridVisible) return;
  let obj = e.target;
  obj.set({
    left: snapToGrid(obj.left),
    top: snapToGrid(obj.top),
  });
});

canvas.on('object:scaling', (e) => {
  if (!gridVisible) return;
  let obj = e.target;
  // Optional: snap scale or width/height to grid here if needed
});

function alignObjects(direction) {
  const activeGroup = canvas.getActiveObject();

  if (!activeGroup || !activeGroup._objects || activeGroup._objects.length < 2) {
    alert("Select multiple objects to align.");
    return;
  }

  const objects = activeGroup._objects;
  const bounds = activeGroup.getBoundingRect();

  objects.forEach(obj => {
    switch (direction) {
      case 'left':
        obj.set({ left: bounds.left - activeGroup.left });
        break;
      case 'center':
        obj.set({ left: (bounds.left + bounds.width / 2) - obj.getScaledWidth() / 2 - activeGroup.left });
        break;
      case 'right':
        obj.set({ left: bounds.left + bounds.width - obj.getScaledWidth() - activeGroup.left });
        break;
      case 'top':
        obj.set({ top: bounds.top - activeGroup.top });
        break;
      case 'middle':
        obj.set({ top: (bounds.top + bounds.height / 2) - obj.getScaledHeight() / 2 - activeGroup.top });
        break;
      case 'bottom':
        obj.set({ top: bounds.top + bounds.height - obj.getScaledHeight() - activeGroup.top });
        break;
    }
    obj.setCoords();
  });

  canvas.requestRenderAll();
}
