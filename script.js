// ---- Signature element: Health Balance Wheel ----
const segments = [
  {label:"Nutrisi", color:"#74A57F", tip:"Isi separuh piring dengan sayur & buah setiap kali makan."},
  {label:"Gerak", color:"#0F3D3E", tip:"150 menit aktivitas sedang per minggu menjaga jantung tetap kuat."},
  {label:"Istirahat", color:"#D4A857", tip:"Tidur 7–9 jam membantu tubuh dan otak pulih sepenuhnya."},
  {label:"Mental", color:"#E8674B", tip:"Jeda sejenak dan bicara dengan orang terdekat menurunkan stres."},
  {label:"Pencegahan", color:"#5A8A93", tip:"Periksa kesehatan rutin membantu deteksi dini sebelum jadi serius."}
];
const svg = document.getElementById('wheel-svg');
const tipEl = document.getElementById('wheel-tip');
const cx=200, cy=200, rOuter=170, rInner=90;
const total = segments.length;
let startAngle = -90;
 
function polar(cx,cy,r,angle){
  const rad = (angle-90)*Math.PI/180;
  return [cx + r*Math.cos(rad), cy + r*Math.sin(rad)];
}
function arcPath(cx,cy,rOut,rIn,a0,a1){
  const [x1,y1]=polar(cx,cy,rOut,a0);
  const [x2,y2]=polar(cx,cy,rOut,a1);
  const [x3,y3]=polar(cx,cy,rIn,a1);
  const [x4,y4]=polar(cx,cy,rIn,a0);
  const large = (a1-a0)%360 > 180 ? 1:0;
  return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4} Z`;
}
 
let html = '';
const step = 360/total;
segments.forEach((seg,i)=>{
  const a0 = i*step - 90;
  const a1 = (i+1)*step - 90;
  const path = arcPath(cx,cy,rOuter,rInner,a0,a1);
  const midAngle = (a0+a1)/2;
  const [lx,ly] = polar(cx,cy,(rOuter+rInner)/2, midAngle+90);
  html += `<path class="wheel-seg" d="${path}" fill="${seg.color}" data-i="${i}" opacity="0.92"></path>`;
});
html += `<circle cx="${cx}" cy="${cy}" r="${rInner-8}" fill="var(--paper)" stroke="var(--line)" stroke-width="1"></circle>`;
html += `<text x="${cx}" y="${cy-6}" text-anchor="middle" class="wheel-center-label">Roda</text>`;
html += `<text x="${cx}" y="${cy+16}" text-anchor="middle" class="wheel-center-label">Keseimbangan</text>`;
svg.innerHTML = html;
 
svg.querySelectorAll('.wheel-seg').forEach(el=>{
  el.addEventListener('mouseenter', (e)=>{
    const i = +el.dataset.i;
    tipEl.textContent = segments[i].label + " — " + segments[i].tip;
    tipEl.classList.add('show');
    el.style.transform = 'scale(1.035)';
  });
  el.addEventListener('mouseleave', ()=>{
    tipEl.classList.remove('show');
    el.style.transform = 'scale(1)';
  });
});
 
// ---- BMI Calculator ----
function hitungIMT(){
  const w = parseFloat(document.getElementById('weight').value);
  const h = parseFloat(document.getElementById('height').value)/100;
  const resultBox = document.getElementById('calc-result');
  if(!w || !h || w<=0 || h<=0){
    resultBox.innerHTML = '<p class="calc-placeholder">Mohon isi berat dan tinggi badan dengan angka yang valid.</p>';
    return;
  }
  const bmi = w/(h*h);
  let cat, color;
  if(bmi < 18.5){cat="Berat badan kurang"; color="var(--gold)";}
  else if(bmi < 25){cat="Berat badan normal"; color="#8FCB9E";}
  else if(bmi < 30){cat="Berat badan berlebih"; color="var(--gold)";}
  else {cat="Obesitas"; color="var(--coral)";}
 
  resultBox.innerHTML = `
    <div class="bmi-num">${bmi.toFixed(1)}</div>
    <div class="bmi-cat" style="color:${color}">${cat}</div>
    <div class="bmi-note">IMT adalah perkiraan kasar dan tidak memperhitungkan massa otot, usia, atau kondisi kesehatan lain. Diskusikan hasil ini dengan tenaga medis untuk interpretasi yang lebih akurat.</div>
  `;
}
 
// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
},{threshold:0.12});
revealEls.forEach(el=>io.observe(el));
