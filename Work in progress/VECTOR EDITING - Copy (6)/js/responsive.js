function resizeCanvas() {
  const canvasEl = document.getElementById('canvas');
  const container = document.getElementById('canvas-container');
  canvas.setWidth(container.clientWidth);
  canvas.setHeight(container.clientHeight);
  canvas.renderAll();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);
