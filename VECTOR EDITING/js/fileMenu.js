// js/fileMenu.js

function newFile() {
  if (confirm('Are you sure you want to start a new file? Unsaved work will be lost.')) {
    canvas.clear();
    canvas.setBackgroundColor('#fff', canvas.renderAll.bind(canvas));
  }
}






function saveFile() {
  const json = JSON.stringify(canvas.toJSON());
  localStorage.setItem('vectorProject', json);
  alert('Project saved to local storage.');
}



const json = canvas.toJSON(['id', 'layerName', 'metadata', 'comments', 'selectable', 'visible']);





function loadFile() {
  const json = localStorage.getItem('vectorProject');
  if (json) {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      updateLayers();
      alert('Project loaded from local storage.');
    });
  } else {
    alert('No saved project found.');
  }
}

function exportSVG() {
  const svg = canvas.toSVG();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'vector_drawing.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        canvas.add(img);
        updateLayers();
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function exitApp() {
  if (confirm('Close the app? Unsaved changes may be lost.')) {
    window.close();
  }
}


// 3. In fileMenu.js – Add the PDF Import Function


async function importPDF(event) {
  const file = event.target.files[0];
  if (!file || !file.name.endsWith('.pdf')) return;

  const reader = new FileReader();
  reader.onload = async function () {
    const typedarray = new Uint8Array(this.result);

    const loadingTask = pdfjsLib.getDocument({ data: typedarray });
    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(1); // First page only
    const viewport = page.getViewport({ scale: 2.0 });

    const canvasEl = document.createElement('canvas');
    canvasEl.width = viewport.width;
    canvasEl.height = viewport.height;
    const ctx = canvasEl.getContext('2d');

    const renderTask = page.render({ canvasContext: ctx, viewport });
    await renderTask.promise;

    const dataUrl = canvasEl.toDataURL();

    // Add to Fabric.js canvas
    fabric.Image.fromURL(dataUrl, (img) => {
      img.set({
        left: 100,
        top: 100,
        selectable: true,
        scaleX: 0.5,
        scaleY: 0.5
      });
      canvas.add(img);
      canvas.requestRenderAll();
    });
  };

  reader.readAsArrayBuffer(file);
}
