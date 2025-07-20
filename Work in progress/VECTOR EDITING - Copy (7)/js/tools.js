// js/tools.js

let bezierHandles = [];

function enableDirectSelection() {
  canvas.selection = false;
  canvas.forEachObject(obj => obj.selectable = false);

  canvas.on('mouse:down', function (opt) {
    const target = opt.target;
    if (target && (target.type === 'path' || target.type === 'polygon' || target.type === 'polyline')) {
      const pointer = canvas.getPointer(opt.e);
      showPathPoints(target);
    } else {
      clearPathPoints();
    }
  });
}

function showPathPoints(obj) {
  clearPathPoints();
  let points = [];

  if (obj.type === 'path') {
    obj.path.forEach((cmd, index) => {
      if (cmd[0] === 'C' || cmd[0] === 'Q') {
        let [x1, y1, x2, y2, x, y] = cmd.slice(1);
        points.push(createHandle(obj.left + x, obj.top + y, obj));
      } else if (cmd[0] === 'L' || cmd[0] === 'M') {
        let [x, y] = cmd.slice(1);
        points.push(createHandle(obj.left + x, obj.top + y, obj));
      }
    });
  } else if (obj.points) {
    obj.points.forEach(pt => {
      const cx = obj.left + pt.x * obj.scaleX;
      const cy = obj.top + pt.y * obj.scaleY;
      points.push(createHandle(cx, cy, obj));
    });
  }

  bezierHandles = points;
  bezierHandles.forEach(h => canvas.add(h));
}

function clearPathPoints() {
  bezierHandles.forEach(h => canvas.remove(h));
  bezierHandles = [];
}

function createHandle(x, y, targetObj) {
  return new fabric.Circle({
    left: x - 4,
    top: y - 4,
    radius: 4,
    fill: 'red',
    stroke: 'white',
    strokeWidth: 1,
    hasControls: false,
    hasBorders: false,
    selectable: true,
    hoverCursor: 'pointer',
    originX: 'center',
    originY: 'center',
    objectCaching: false,
    targetObj
  });
}

function selectTool(tool) {
  activeTool = tool;
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.forEachObject(obj => obj.selectable = true);
  clearPathPoints();

  const defaultColor = '#333333';

  switch (tool) {
    case 'pen':
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = defaultColor;
      break;

    case 'direct':
      enableDirectSelection();
      break;

    case 'text':
      canvas.add(new fabric.IText('Text', {
        left: 100,
        top: 100,
        fill: defaultColor,
      }));
      break;

    case 'rect':
      canvas.add(new fabric.Rect({
        left: 50,
        top: 50,
        fill: defaultColor,
        width: 100,
        height: 100,
      }));
      break;

    case 'circle':
      canvas.add(new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: defaultColor,
      }));
      break;

    case 'line':
      canvas.add(new fabric.Line([50, 50, 200, 200], {
        stroke: defaultColor,
        strokeWidth: 2,
      }));
      break;

    case 'polygon':
      canvas.add(new fabric.Polygon([
        { x: 200, y: 10 },
        { x: 250, y: 50 },
        { x: 220, y: 100 },
        { x: 180, y: 100 },
        { x: 150, y: 50 }
      ], {
        fill: defaultColor,
        left: 100,
        top: 100,
      }));
      break;

    case 'lasso':
      alert('Lasso tool not implemented yet.');
      break;
  }

  canvas.requestRenderAll();
  updateLayers();
}

// The rest of the existing functions (updateColor, updateColorPickers, updatePropertiesPanel...) remain unchanged


function updateColor(type) {
  const color = document.getElementById(`${type}Color`).value;
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set(type, color);
    canvas.renderAll();
  }
}

canvas.on('selection:created', updateColorPickers);
canvas.on('selection:updated', updateColorPickers);

function updateColorPickers() {
  const obj = canvas.getActiveObject();
  if (obj) {
    document.getElementById('fillColor').value = obj.fill || '#333333';
    document.getElementById('strokeColor').value = obj.stroke || '#333333';
    document.getElementById('strokeWidth').value = obj.strokeWidth || 1;
    document.getElementById('opacity').value = obj.opacity != null ? obj.opacity : 1;
    document.getElementById('blendMode').value = obj.globalCompositeOperation || 'normal';
  }
}

canvas.on('selection:cleared', () => {
  document.getElementById('fillColor').value = '#333333';
  document.getElementById('strokeColor').value = '#333333';
  document.getElementById('strokeWidth').value = 1;
  document.getElementById('opacity').value = 1;
});

function updateStrokeWidth(value) {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('strokeWidth', parseFloat(value));
    canvas.requestRenderAll();
  }
}

function updateOpacity(value) {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('opacity', parseFloat(value));
    canvas.requestRenderAll();
  }
}

function updateBlendMode(mode) {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.globalCompositeOperation = mode;
    canvas.requestRenderAll();
  }
}

function updatePropertiesPanel(obj) {
  if (!obj) return;

  document.getElementById('propLeft').value = Math.round(obj.left || 0);
  document.getElementById('propTop').value = Math.round(obj.top || 0);
  document.getElementById('propWidth').value = Math.round(obj.width * obj.scaleX || 0);
  document.getElementById('propHeight').value = Math.round(obj.height * obj.scaleY || 0);
  document.getElementById('propAngle').value = Math.round(obj.angle || 0);
}

function updateProperty(prop) {
  const obj = canvas.getActiveObject();
  if (!obj) return;

  switch (prop) {
    case 'left':
      obj.set('left', parseFloat(document.getElementById('propLeft').value));
      break;
    case 'top':
      obj.set('top', parseFloat(document.getElementById('propTop').value));
      break;
    case 'width':
      const width = parseFloat(document.getElementById('propWidth').value);
      obj.set('scaleX', width / obj.width);
      break;
    case 'height':
      const height = parseFloat(document.getElementById('propHeight').value);
      obj.set('scaleY', height / obj.height);
      break;
    case 'angle':
      obj.set('angle', parseFloat(document.getElementById('propAngle').value));
      break;
  }

  obj.setCoords();
  canvas.requestRenderAll();
}

canvas.on('selection:created', e => updatePropertiesPanel(e.selected[0]));
canvas.on('selection:updated', e => updatePropertiesPanel(e.selected[0]));
canvas.on('object:modified', e => updatePropertiesPanel(e.target));

const modal = document.getElementById('propertiesModal');
const openBtn = document.getElementById('openPropertiesBtn');
const closeBtn = document.getElementById('closePropertiesBtn');

openBtn.onclick = () => {
  const obj = canvas.getActiveObject();
  if (!obj) {
    alert('Select an object first.');
    return;
  }
  updatePropertiesPanel(obj);
  modal.style.display = 'block';
};

closeBtn.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
