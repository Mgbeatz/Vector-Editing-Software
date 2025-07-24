function resizeCanvas() {
  const canvasEl = document.getElementById('canvas');
  const container = document.getElementById('canvas-container');
  canvas.setWidth(container.clientWidth);
  canvas.setHeight(container.clientHeight);
  canvas.renderAll();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);



























const zoomRange = document.getElementById('zoomRange');
const zoomValue = document.getElementById('zoomValue');
const zoomResetBtn = document.getElementById('zoomResetBtn');

zoomRange.addEventListener('input', () => {
  const zoomPercent = parseInt(zoomRange.value, 10);
  zoomValue.textContent = zoomPercent + '%';

  const container = document.querySelector('.canvas-container');
  const center = {
    x: container.clientWidth / 2,
    y: container.clientHeight / 2,
  };

  canvas.zoomToPoint(new fabric.Point(center.x, center.y), zoomPercent / 100);
  canvas.renderAll();
});

zoomResetBtn.addEventListener('click', () => {
  zoomRange.value = 100;
  zoomValue.textContent = '100%';
  canvas.setZoom(1);
  canvas.viewportTransform = [1, 0, 0, 1, 0, 0]; // Reset pan
  canvas.renderAll();
});
