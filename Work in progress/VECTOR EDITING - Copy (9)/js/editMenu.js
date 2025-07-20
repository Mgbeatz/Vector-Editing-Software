// js/editMenu.js

function undo() {
  alert('Undo functionality is not fully implemented yet.');
  // For full undo stack support, consider tracking canvas states manually
}

function redo() {
  alert('Redo functionality is not fully implemented yet.');
  // Same as undo: use custom state stack if needed
}

function deleteObject() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject);
    updateLayers();
  }
}

function copy() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.clone((cloned) => {
      clipboard = cloned;
    });
  }
}

function paste() {
  if (!clipboard) return;
  clipboard.clone((clonedObj) => {
    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
    });
    canvas.add(clonedObj);
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
    updateLayers();
  });
}

function group() {
  const active = canvas.getActiveObject();
  if (active && active.type === 'activeSelection') {
    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
    updateLayers();
  }
}

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') undo();
  else if (e.ctrlKey && e.key === 'y') redo();
  else if (e.ctrlKey && e.key === 'c') copy();
  else if (e.ctrlKey && e.key === 'v') paste();
  else if (e.ctrlKey && e.key === 'g') group();
  else if (e.key === 'Delete') deleteObject();
});


if (e.key.toLowerCase() === 'g') {
  toggleGrid();
}


//  2. Add Grouping & Naming Support to editMenu.js


function groupSelected() {
  const sel = canvas.getActiveObject();

  if (!sel || !sel._objects || sel._objects.length < 2) {
    alert('Select multiple objects to group.');
    return;
  }

  const group = new fabric.Group(sel._objects, {
    name: prompt("Enter group name:", `Group ${Math.floor(Math.random() * 1000)}`) || undefined
  });

  canvas.remove(...sel._objects);
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.requestRenderAll();
  updateLayerPanel();
}

function ungroupSelected() {
  const sel = canvas.getActiveObject();
  if (!sel || sel.type !== 'group') {
    alert("No group selected.");
    return;
  }

  sel.toActiveSelection();
  canvas.requestRenderAll();
  updateLayerPanel();
}


// 4. Add Shortcut to editMenu.js:


document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.key === 'g') {
    e.preventDefault();
    groupSelected();
  } else if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    ungroupSelected();
  }
});

