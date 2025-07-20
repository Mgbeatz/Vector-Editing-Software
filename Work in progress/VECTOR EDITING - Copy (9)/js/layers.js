// js/layers.js

function updateLayers() {
  const layerList = document.getElementById('layers');
  layerList.innerHTML = '';

  const objects = canvas.getObjects();
  objects.forEach((obj, index) => {
    const li = document.createElement('li');
    li.textContent = `${obj.type} #${index}`;
    li.onclick = () => {
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
    };
    layerList.appendChild(li);
  });
}









// 1. Update layers.js – Add Group Managemen

function updateLayerPanel() {
  const layerList = document.getElementById('layer-list');
  layerList.innerHTML = '';

  const objects = canvas.getObjects().slice().reverse(); // topmost first

  objects.forEach((obj, index) => {
    const item = document.createElement('div');
    item.className = 'layer-item';

    // 🖊️ Editable Name
    const name = document.createElement('input');
    name.type = 'text';
    name.value = obj.layerName || obj.type;
    name.className = 'layer-name';
    name.onchange = () => {
      obj.layerName = name.value;
      canvas.requestRenderAll();
    };

    // 👁️ Visibility Toggle
    const visibilityBtn = document.createElement('button');
    visibilityBtn.textContent = obj.visible ? '👁️' : '🚫';
    visibilityBtn.onclick = () => {
      obj.visible = !obj.visible;
      visibilityBtn.textContent = obj.visible ? '👁️' : '🚫';
      canvas.requestRenderAll();
    };

    // 🔒 Lock/Unlock Toggle
    const lockBtn = document.createElement('button');
    lockBtn.textContent = obj.selectable ? '🔓' : '🔒';
    lockBtn.onclick = () => {
      obj.selectable = !obj.selectable;
      obj.evented = obj.selectable;
      lockBtn.textContent = obj.selectable ? '🔓' : '🔒';
      canvas.requestRenderAll();
    };

    // 🗑️ Delete Layer
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.onclick = () => {
      canvas.remove(obj);
      updateLayerPanel();
    };

    // 🖱️ Select on canvas
    item.onclick = () => {
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
    };

    // Compose the layer row
    item.appendChild(name);
    item.appendChild(visibilityBtn);
    item.appendChild(lockBtn);
    item.appendChild(deleteBtn);
    layerList.appendChild(item);
  });
}




// In layers.js, define the function:

function addNewLayer() {
  const rect = new fabric.Rect({
    width: 100,
    height: 60,
    fill: 'rgba(200,200,255,0.3)',
    stroke: 'blue',
    left: 50,
    top: 50,
    layerName: 'New Layer'
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
  updateLayerPanel();
}











// If you want to show only a label (not input) and switch to rename on double-click:


const label = document.createElement('span');
label.innerText = obj.layerName || obj.type;
label.ondblclick = () => {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = label.innerText;
  input.onblur = () => {
    obj.layerName = input.value;
    updateLayerPanel();
  };
  item.replaceChild(input, label);
};
item.appendChild(label);



const json = canvas.toJSON(['id', 'metadata', 'comments', 'layerName']);




function selectLayer(index) {
  const obj = canvas.item(index);
  canvas.setActiveObject(obj);
  canvas.requestRenderAll();
}

function ungroupLayer(index) {
  const group = canvas.item(index);
  if (group.type !== 'group') return;

  group.toActiveSelection();
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  updateLayerPanel();
}
