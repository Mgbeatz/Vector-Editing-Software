function getTargets() {
  return canvas.getActiveObjects();
}

function applyShadowEffectToAll(type) {
  const targets = getTargets();
  const blur = parseInt(document.getElementById('blurSlider').value);
  const offsetX = parseInt(document.getElementById('offsetXSlider').value);
  const offsetY = parseInt(document.getElementById('offsetYSlider').value);
  const opacity = parseFloat(document.getElementById('opacitySlider').value);
  const color = document.getElementById('shadowColorPicker').value;

  let rgba = hexToRgba(color, opacity);

  let shadowOpts = {
    color: rgba,
    blur,
    offsetX,
    offsetY
  };

  if (type === 'glow') {
    shadowOpts.offsetX = 0;
    shadowOpts.offsetY = 0;
  } else if (type === 'outerGlow') {
    shadowOpts.color = hexToRgba('#00c8ff', opacity);
    shadowOpts.blur = 20;
    shadowOpts.offsetX = 0;
    shadowOpts.offsetY = 0;
  }

  targets.forEach(obj => {
    obj.set('shadow', new fabric.Shadow(shadowOpts));
  });
  canvas.requestRenderAll();
}

function clearAllShadows() {
  const targets = getTargets();
  targets.forEach(obj => obj.set('shadow', null));
  canvas.requestRenderAll();
}

function hexToRgba(hex, alpha = 1) {
  let r = parseInt(hex.substring(1, 3), 16),
      g = parseInt(hex.substring(3, 5), 16),
      b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Events
document.getElementById('dropShadowToggle').addEventListener('change', e => {
  if (e.target.checked) applyShadowEffectToAll('drop');
  else clearAllShadows();
});

document.getElementById('glowToggle').addEventListener('change', e => {
  if (e.target.checked) applyShadowEffectToAll('glow');
  else clearAllShadows();
});

document.getElementById('outerGlowToggle').addEventListener('change', e => {
  if (e.target.checked) applyShadowEffectToAll('outerGlow');
  else clearAllShadows();
});

document.getElementById('applyOverlay').addEventListener('click', () => {
  const targets = getTargets();
  const color = document.getElementById('overlayColor').value;
  targets.forEach(obj => {
    obj.set('fill', color);
  });
  canvas.requestRenderAll();
});

document.getElementById('clearEffectsBtn').addEventListener('click', () => {
  clearAllShadows();
});

















let effectPresets = {};

function saveEffectPreset(name) {
  const preset = {
    blur: document.getElementById('blurSlider').value,
    offsetX: document.getElementById('offsetXSlider').value,
    offsetY: document.getElementById('offsetYSlider').value,
    opacity: document.getElementById('opacitySlider').value,
    color: document.getElementById('shadowColorPicker').value
  };

  effectPresets[name] = preset;
  updatePresetDropdown();
}

function applyEffectPreset(name) {
  const preset = effectPresets[name];
  if (!preset) return;

  document.getElementById('blurSlider').value = preset.blur;
  document.getElementById('offsetXSlider').value = preset.offsetX;
  document.getElementById('offsetYSlider').value = preset.offsetY;
  document.getElementById('opacitySlider').value = preset.opacity;
  document.getElementById('shadowColorPicker').value = preset.color;

  applyCurrentEffect();
}

function updatePresetDropdown() {
  const select = document.getElementById('presetSelect');
  select.innerHTML = '<option value="">-- Select Preset --</option>';
  for (let name in effectPresets) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  }
}

// Save preset button
document.getElementById('savePresetBtn').addEventListener('click', () => {
  const name = document.getElementById('presetName').value.trim();
  if (name) {
    saveEffectPreset(name);
    document.getElementById('presetName').value = '';
  }
});

// On preset select
document.getElementById('presetSelect').addEventListener('change', (e) => {
  if (e.target.value) applyEffectPreset(e.target.value);
});





//Undo and redo



let undoStack = [];
let redoStack = [];

function saveState() {
  const json = canvas.toJSON();
  undoStack.push(json);
  if (undoStack.length > 50) undoStack.shift();
  redoStack = [];
}

function undo() {
  if (undoStack.length > 0) {
    const currentState = canvas.toJSON();
    redoStack.push(currentState);
    const prevState = undoStack.pop();
    canvas.loadFromJSON(prevState, () => canvas.renderAll());
  }
}

function redo() {
  if (redoStack.length > 0) {
    const currentState = canvas.toJSON();
    undoStack.push(currentState);
    const nextState = redoStack.pop();
    canvas.loadFromJSON(nextState, () => canvas.renderAll());
  }
}

function exportCanvas(type = 'png') {
  const dataURL = canvas.toDataURL({
    format: type,
    quality: 1.0
  });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `canvas_export.${type}`;
  link.click();
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    undo();
  } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
    e.preventDefault();
    redo();
  }
});

// Attach saveState to canvas events
canvas.on('object:modified', saveState);
canvas.on('object:added', saveState);
canvas.on('object:removed', saveState);



// zoom


// Zoom config
let zoomLevel = 1;
const zoomStep = 0.1;
const minZoom = 0.1;
const maxZoom = 5;

canvas.getElement().addEventListener("wheel", function (e) {
  if (e.shiftKey) {
    e.preventDefault(); // Prevent horizontal scroll
    const pointer = canvas.getPointer(e);
    let zoomDirection = e.deltaY < 0 ? 1 : -1; // Up = zoom in, Down = zoom out
    zoomLevel = Math.min(maxZoom, Math.max(minZoom, zoomLevel + zoomDirection * zoomStep));
    canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoomLevel);
  }
}, { passive: false });








// image import


function importImage() {
  document.getElementById('imageInput').click();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    fabric.Image.fromURL(e.target.result, function (img) {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5
      });
      canvas.add(img);
      canvas.setActiveObject(img);
    });
  };
  reader.readAsDataURL(file);
}

// import pdf

function importPDF(event) {
  const file = event.target.files[0];
  if (!file || file.type !== "application/pdf") return;

  const fileReader = new FileReader();
  fileReader.onload = function () {
    const typedarray = new Uint8Array(this.result);

    pdfjsLib.getDocument({ data: typedarray }).promise.then(function (pdf) {
      // Load the first page only
      pdf.getPage(1).then(function (page) {
        const viewport = page.getViewport({ scale: 2.0 });
        const canvasPDF = document.createElement('canvas');
        const context = canvasPDF.getContext('2d');
        canvasPDF.width = viewport.width;
        canvasPDF.height = viewport.height;

        page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
          fabric.Image.fromURL(canvasPDF.toDataURL(), function (img) {
            img.set({ left: 100, top: 100 });
            canvas.add(img);
            canvas.setActiveObject(img);
          });
        });
      });
    });
  };

  fileReader.readAsArrayBuffer(file);
}
