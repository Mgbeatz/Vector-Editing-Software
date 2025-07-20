// js/tools.js

function selectTool(tool) {
  activeTool = tool;
  canvas.isDrawingMode = false;

  const defaultColor = '#333333'; // Dark grey

  switch (tool) {
    case 'pen':
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = defaultColor;
      break;

    case 'text':
      const text = new fabric.IText('Text', {
        left: 100,
        top: 100,
        fill: defaultColor,
      });
      canvas.add(text);
      break;

    case 'rect':
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        fill: defaultColor,
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
        fill: defaultColor,
      });
      canvas.add(circle);
      break;

    case 'line':
      const line = new fabric.Line([50, 50, 200, 200], {
        stroke: defaultColor,
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
          fill: defaultColor,
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












// Add this listener to update the color inputs when an object is selected:

canvas.on('selection:created', updateColorPickers);
canvas.on('selection:updated', updateColorPickers);

function updateColorPickers() {
  const obj = canvas.getActiveObject();
  if (obj) {
    const fillInput = document.getElementById('fillColor');
    const strokeInput = document.getElementById('strokeColor');

    fillInput.value = obj.fill || '#333333';
    strokeInput.value = obj.stroke || '#333333';
  }
}











 // Add these JS functions to your script (tools.js or app.js):


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




//  3. Extend your updateColorPickers() function to update these controls when selecting an object:

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






 // 4. Bonus: Reset values when nothing is selected (optional)

 canvas.on('selection:cleared', () => {
  document.getElementById('fillColor').value = '#333333';
  document.getElementById('strokeColor').value = '#333333';
  document.getElementById('strokeWidth').value = 1;
  document.getElementById('opacity').value = 1;
});





// 📜 JavaScript Function (app.js or tools.js):

function updateBlendMode(mode) {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.globalCompositeOperation = mode;
    canvas.requestRenderAll();
  }
}
