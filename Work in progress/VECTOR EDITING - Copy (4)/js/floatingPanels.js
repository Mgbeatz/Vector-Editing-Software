function makeDraggable(selector) {
  interact(selector)
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })
      ],
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    });
}

// Make panels draggable
window.addEventListener('load', () => {
  makeDraggable('#tool-panel');
  makeDraggable('#layer-panel');
  makeDraggable('#alignment-panel');
});
