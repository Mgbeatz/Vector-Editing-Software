// js/tools.js

function selectTool(tool) {
  activeTool = tool;
  canvas.isDrawingMode = false;

  switch (tool) {
    case 'pen':
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 2;
      break;

    case 'text':
      const text = new fabric.IText('Text', { left: 100, top: 100 });
      canvas.add(text);
      break;

    case 'rect':
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        fill: '#f00',
        width: 100,
        height: 100,
      });
      canvas.add(rect);
      break;

    case 'circle':
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: '#0f0',
      });
      canvas.add(circle);
      break;

    case 'line':
      const line = new fabric.Line([50, 50, 200, 200], {
        stroke: '#000',
        strokeWidth: 2,
      });
      canvas.add(line);
      break;

    case 'polygon':
      const polygon = new fabric.Polygon(
        [
          { x: 200, y: 10 },
          { x: 250, y: 50 },
          { x: 220, y: 100 },
          { x: 180, y: 100 },
          { x: 150, y: 50 },
        ],
        {
          fill: '#00f',
          left: 100,
          top: 100,
        }
      );
      canvas.add(polygon);
      break;

    case 'lasso':
      alert('Lasso tool not implemented yet.');
      break;
  }

  canvas.requestRenderAll();
  updateLayers();
}

function updateColor(type) {
  const color = document.getElementById(`${type}Color`).value;
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set(type, color);
    canvas.renderAll();
  }
}
