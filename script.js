// Load names from localStorage
let names = JSON.parse(localStorage.getItem('names') || '[]');

// Add name (settings page)
document.getElementById('addNameBtn')?.addEventListener('click', () => {
    const input = document.getElementById('nameInput');
    if (input.value.trim() !== '') {
        names.push(input.value.trim());
        localStorage.setItem('names', JSON.stringify(names));
        renderList();
        input.value = '';
    }
});

function renderList() {
    const list = document.getElementById('nameList');
    if (!list) return;
    list.innerHTML = '';
    names.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n;
        list.appendChild(li);
    });
}
renderList();

// Wheel rendering
const wheel = document.getElementById('wheel');
const ctx = wheel?.getContext('2d');

function drawWheel() {
    if (!ctx || names.length === 0) return;
    const radius = wheel.width/2;
    const arc = (2*Math.PI) / names.length;
    names.forEach((name, i) => {
        const angle = i * arc;
        ctx.beginPath();
        ctx.fillStyle = randomColor(i);
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + arc);
        ctx.fill();
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + arc/2);
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(name, radius/2, 0);
        ctx.restore();
    });
}

function randomColor(i){
    // deterministic random color
    const r = (i*70)%255, g=(i*130)%255, b=(i*200)%255;
    return `rgb(${r},${g},${b})`;
}

let rotation = 0;

function spin() {
    if (!ctx || names.length === 0) return;
    const spinTime = 3000;
    const finalRotation = rotation + Math.random()*2000 + 2000;
    const start = performance.now();

    function animate(t) {
        const progress = Math.min((t - start)/spinTime, 1);
        rotation = easeOut(progress) * finalRotation;
        ctx.clearRect(0,0,wheel.width,wheel.height);
        ctx.save();
        ctx.translate(wheel.width/2, wheel.height/2);
        ctx.rotate(rotation * Math.PI/180);
        ctx.translate(-wheel.width/2, -wheel.height/2);
        drawWheel();
        ctx.restore();
        if (progress < 1) requestAnimationFrame(animate);
        else finishSpin();
    }
    requestAnimationFrame(animate);
}

function easeOut(x){ return 1 - Math.pow(1 - x, 3); }

function finishSpin(){
    const arc = 360 / names.length;
    const index = Math.floor(((rotation % 360)+360)%360 / arc);
    const winner = names[names.length - 1 - index];
    document.getElementById('result').textContent = winner;
}

document.getElementById('spinBtn')?.addEventListener('click', spin);

drawWheel();
