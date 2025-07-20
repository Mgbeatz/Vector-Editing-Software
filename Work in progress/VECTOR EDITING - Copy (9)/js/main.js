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










// CALCULATOR



function evaluateCalc() {
  const screen = document.getElementById('calcScreen');
  try {
    screen.value = eval(screen.value); // Simple eval for basic expressions
  } catch (e) {
    screen.value = 'Error';
  }
}

function resetCalc() {
  document.getElementById('calcScreen').value = '';
}


document.getElementById('calcScreen').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    evaluateCalc();
  }
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

// Drag-and-drop listeners
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

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const type = file.type;

  // Confirm before importing
  const confirmImport = confirm(`Do you want to import this file: ${file.name}?`);
  if (!confirmImport) return;

  if (type === "application/pdf") {
    importPDFFile(file);
  } else if (type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.set({ left: e.offsetX, top: e.offsetY });
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  } else {
    alert("Unsupported file type. Only images and PDFs allowed.");
  }
});
