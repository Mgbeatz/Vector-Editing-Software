


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
