let shape = JSON.parse(JSON.stringify(INITIAL_SHAPE));
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Функция отрисовки
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  shape.forEach(([x,y], i) => {
    if (i === 0) ctx.moveTo(x,y);
    else         ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.stroke();
}

// Универсальный вызов API
async function transform(op, params) {
  const resp = await fetch('/api/transform', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({op, params, shape})
  });
  const data = await resp.json();
  shape = data.shape;
  draw();
}

// Навешиваем кнопки
document.querySelectorAll('button[data-op]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const op = btn.dataset.op;
    let params = {};
    if (op === 'translate') {
      params.dx = +document.getElementById('dx').value;
      params.dy = +document.getElementById('dy').value;
    }
    if (op === 'rotate') {
      params.angle = +document.getElementById('angle').value;
      params.cx    = +document.getElementById('cxr').value;
      params.cy    = +document.getElementById('cyr').value;
    }
    if (op === 'scale') {
      params.kx = +document.getElementById('kx').value;
      params.ky = +document.getElementById('ky').value;
      params.cx = +document.getElementById('cxs').value;
      params.cy = +document.getElementById('cys').value;
    }
    transform(op, params);
  });
});

// Сброс
document.getElementById('reset').addEventListener('click', ()=>{
  shape = JSON.parse(JSON.stringify(INITIAL_SHAPE));
  draw();
});

// Первая отрисовка
draw();
