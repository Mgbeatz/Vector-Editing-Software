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
