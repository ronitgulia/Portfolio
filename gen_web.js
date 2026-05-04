const fs = require('fs');
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n`;

const spokes = 12;
const cx = 50, cy = 50;

for (let i = 0; i < spokes; i++) {
  const angle = (i * Math.PI * 2) / spokes;
  const x = cx + Math.cos(angle) * 48;
  const y = cy + Math.sin(angle) * 48;
  svg += `  <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" />\n`;
}

const rings = [10, 22, 35, 48];
for (const r of rings) {
  let path = `  <path d="`;
  for (let i = 0; i < spokes; i++) {
    const angle1 = (i * Math.PI * 2) / spokes;
    const angle2 = ((i + 1) * Math.PI * 2) / spokes;
    
    const x1 = cx + Math.cos(angle1) * r;
    const y1 = cy + Math.sin(angle1) * r;
    const x2 = cx + Math.cos(angle2) * r;
    const y2 = cy + Math.sin(angle2) * r;
    
    const midAngle = (angle1 + angle2) / 2;
    const sag = r * 0.8;
    const qx = cx + Math.cos(midAngle) * sag;
    const qy = cy + Math.sin(midAngle) * sag;
    
    if (i === 0) {
      path += `M ${x1.toFixed(1)} ${y1.toFixed(1)} `;
    }
    path += `Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} `;
  }
  path += `Z" />\n`;
}
svg += `</svg>`;
fs.writeFileSync('spider-web.svg', svg);