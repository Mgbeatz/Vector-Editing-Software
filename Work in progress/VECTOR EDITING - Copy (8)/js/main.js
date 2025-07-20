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
