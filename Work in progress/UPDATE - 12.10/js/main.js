const snappingBtn = document.getElementById('snappingToggleBtn');
const snappingOptions = document.getElementById('snappingOptions');

snappingBtn.onclick = () => {
  snappingOptions.classList.toggle('show');
};

// Update snapping flags
let snapToEndpoint = true;
let snapToMidpoint = false;
let snapToRadius = false;
let snapToTangent = false;

document.getElementById('snap-endpoint').onchange = e => snapToEndpoint = e.target.checked;
document.getElementById('snap-midpoint').onchange = e => snapToMidpoint = e.target.checked;
document.getElementById('snap-radius').onchange = e => snapToRadius = e.target.checked;
document.getElementById('snap-tangent').onchange = e => snapToTangent = e.target.checked;


// Close dropdown when clicking outside
window.addEventListener('click', (event) => {
  if (!snappingBtn.contains(event.target) && !snappingOptions.contains(event.target)) {
    snappingOptions.classList.remove('show');
  }
});






const resizer = document.getElementById("resizer");
const wrapper = document.getElementById("side-wrapper");

let isResizing = false;

resizer.addEventListener("mousedown", (e) => {
  isResizing = true;
  document.body.style.cursor = "ew-resize";
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;
  const newWidth = e.clientX;
  const minWidth = 200;
  const maxWidth = 600;
  if (newWidth >= minWidth && newWidth <= maxWidth) {
    wrapper.style.width = `${newWidth}px`;
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = "default";
});







// Allow multi-selection (Fabric does this by default, just ensure it's enabled)
canvas.selection = true;

// Listen for Delete key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      if (activeObject.type === 'activeSelection') {
        // Remove all objects in the active selection
        activeObject._objects.forEach(obj => canvas.remove(obj));
        canvas.discardActiveObject();
      } else {
        // Remove single selected object
        canvas.remove(activeObject);
      }
      canvas.requestRenderAll();
      updateLayers(); // Update your layers panel if you have one
    }
  }
});



// drag and drop


const canvasContainer = document.getElementById('canvas-container');

// Handle drag-over style
canvasContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  canvasContainer.classList.add("dragging");
});

canvasContainer.addEventListener("dragleave", () => {
  canvasContainer.classList.remove("dragging");
});

canvasContainer.addEventListener("drop", async (e) => {
  e.preventDefault();
  canvasContainer.classList.remove("dragging");

  const files = Array.from(e.dataTransfer.files);
  if (files.length === 0) return;

  for (const file of files) {
    const type = file.type;
    const fileName = file.name;

    const confirmImport = confirm(`Do you want to import this file: ${fileName}?`);
    if (!confirmImport) continue;

    if (type === "application/pdf") {
      await importPDFFile(file, e.offsetX, e.offsetY);
    } else if (type.startsWith("image/")) {
      await importImageFile(file, e.offsetX, e.offsetY);
    } else {
      alert(`Unsupported file type: ${fileName}`);
    }
  }
});


// will come back later

// inside drop handler after successful import
addImportHistory(fileName);


// After canvas.add(img);
addImportHistory(fileName);


// Import image file
async function importImageFile(file, offsetX, offsetY) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        scaleToFit(img);
        positionObject(img, offsetX, offsetY);
        canvas.add(img);
        canvas.setActiveObject(img);
        resolve();
      });
    };
    reader.readAsDataURL(file);
  });
}

// Import PDF file (multi-page support)
async function importPDFFile(file, offsetX, offsetY) {
  const reader = new FileReader();
  reader.onload = async function () {
    const typedArray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvasEl = document.createElement("canvas");
      const context = canvasEl.getContext("2d");
      canvasEl.width = viewport.width;
      canvasEl.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const dataUrl = canvasEl.toDataURL("image/png");

      fabric.Image.fromURL(dataUrl, (img) => {
        scaleToFit(img);
        positionObject(img, offsetX + i * 20, offsetY + i * 20); // offset each page
        canvas.add(img);
      });
    }
  };
  reader.readAsArrayBuffer(file);
}

// Auto-scale large images
function scaleToFit(obj) {
  const maxW = canvas.getWidth() * 0.8;
  const maxH = canvas.getHeight() * 0.8;

  const scaleW = maxW / obj.width;
  const scaleH = maxH / obj.height;
  const scale = Math.min(1, scaleW, scaleH);

  obj.scale(scale);
}

// Center or place at drop location
function positionObject(obj, x, y) {
  if (typeof x === 'number' && typeof y === 'number') {
    obj.set({ left: x, top: y });
  } else {
    obj.set({
      left: canvas.getWidth() / 2 - (obj.getScaledWidth() / 2),
      top: canvas.getHeight() / 2 - (obj.getScaledHeight() / 2),
    });
  }
}





// History array to track imports (file names and timestamps)
let importHistory = JSON.parse(localStorage.getItem('importHistory') || '[]');

// Function to add to history and update UI + localStorage
function addImportHistory(fileName) {
  const time = new Date().toLocaleTimeString();
  importHistory.push(`${time}: Imported "${fileName}"`);
  if (importHistory.length > 20) importHistory.shift(); // limit to last 20 entries
  localStorage.setItem('importHistory', JSON.stringify(importHistory));
  renderImportHistory();
}

// Render import history UI list
function renderImportHistory() {
  const ul = document.getElementById('import-history-list');
  if (!ul) return;
  ul.innerHTML = '';
  importHistory.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    ul.appendChild(li);
  });
}

// Call once on load
renderImportHistory();











// Before adding new objects on import, save state
function saveCanvasState() {
  const json = canvas.toJSON();
  undoStack.push(json);
  redoStack = [];
}

// When importing:
saveCanvasState();
// then add new objects

// Undo function (if not implemented)
function undo() {
  if (undoStack.length === 0) return;
  const lastState = undoStack.pop();
  redoStack.push(canvas.toJSON());
  canvas.loadFromJSON(lastState, () => canvas.renderAll());
}

// Redo function (if not implemented)
function redo() {
  if (redoStack.length === 0) return;
  const nextState = redoStack.pop();
  undoStack.push(canvas.toJSON());
  canvas.loadFromJSON(nextState, () => canvas.renderAll());
}


