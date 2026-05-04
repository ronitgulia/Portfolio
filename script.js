gsap.registerPlugin(ScrollTrigger);

// ── PRELOADER ──
window.addEventListener('load', () => {
  let progress = 0;
  const progressEl = document.getElementById('progress');
  const preloader = document.getElementById('preloader');
  
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress > 100) progress = 100;
    progressEl.style.width = progress + '%';
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    }
  }, 100);
});

// ── THEME SWITCHER ──
const themes = [
  { id: 'earth-42', name: 'EARTH-42' },
  { id: 'earth-65', name: 'EARTH-65 (GWEN)' },
  { id: 'earth-928', name: 'EARTH-928 (MIGUEL)' }
];
let currentThemeIdx = 0;
document.getElementById('themeSwitcher').addEventListener('click', (e) => {
  currentThemeIdx = (currentThemeIdx + 1) % themes.length;
  const theme = themes[currentThemeIdx];
  document.documentElement.setAttribute('data-theme', theme.id);
  document.querySelector('.theme-name').innerText = theme.name;
  
  // Trigger mini spider-sense on theme change
  document.body.classList.add('spider-sense');
  setTimeout(() => document.body.classList.remove('spider-sense'), 200);
});

// ── SPIDER-SENSE RANDOM TRIGGER ──
setInterval(() => {
  if (Math.random() > 0.8) { // 20% chance every 10s
    document.body.classList.add('spider-sense');
    setTimeout(() => document.body.classList.remove('spider-sense'), 200);
  }
}, 10000);

// ── WEB SHOOTER ──
const webCanvas = document.getElementById('webShooterCanvas');
const webCtx = webCanvas.getContext('2d');
let webW, webH;
function resizeWeb() {
  if(!webCanvas) return;
  webW = webCanvas.width = window.innerWidth;
  webH = webCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeWeb);
resizeWeb();

let webs = [];
document.addEventListener('click', (e) => {
  if (e.target.closest('#themeSwitcher') || e.target.tagName === 'A' || e.target.closest('a') || e.target.closest('button')) return;
  
  webs.push({
    x: window.innerWidth / 2, 
    y: window.innerHeight, 
    targetX: e.clientX, 
    targetY: e.clientY, 
    progress: 0,
    opacity: 1,
    strands: Array.from({length: 4}, () => ({
      freq: Math.random() * 0.05 + 0.02,
      amp: Math.random() * 15 + 5,
      offset: Math.random() * Math.PI * 2
    }))
  });
});

function drawWebs() {
  if(!webCtx) return;
  webCtx.clearRect(0, 0, webW, webH);
  for (let i = webs.length - 1; i >= 0; i--) {
    let w = webs[i];
    w.progress += 0.08; // slightly slower for dramatic effect
    if (w.progress > 1) {
      w.opacity -= 0.04;
    }
    
    if (w.opacity <= 0) {
      webs.splice(i, 1);
      continue;
    }
    
    const currentX = w.x + (w.targetX - w.x) * Math.min(w.progress, 1);
    const currentY = w.y + (w.targetY - w.y) * Math.min(w.progress, 1);
    const dx = currentX - w.x;
    const dy = currentY - w.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const pX = Math.cos(angle + Math.PI/2);
    const pY = Math.sin(angle + Math.PI/2);

    webCtx.strokeStyle = `rgba(255, 255, 255, ${w.opacity})`;
    webCtx.lineCap = 'round';
    webCtx.lineJoin = 'round';
    
    // Draw thick central strand
    webCtx.lineWidth = 2.5;
    webCtx.beginPath();
    webCtx.moveTo(w.x, w.y);
    webCtx.lineTo(currentX, currentY);
    webCtx.stroke();

    // Draw wavy/intertwined web strands
    webCtx.lineWidth = 0.8;
    w.strands.forEach(strand => {
      webCtx.beginPath();
      webCtx.moveTo(w.x, w.y);
      for (let d = 0; d < dist; d += 8) {
        // Taper the waves so they are tight at the shooter and the target, and wide in the middle
        const taper = Math.sin((d / dist) * Math.PI);
        const wave = Math.sin(d * strand.freq + strand.offset + w.progress * 15) * strand.amp * taper;
        const ptX = w.x + Math.cos(angle) * d + pX * wave;
        const ptY = w.y + Math.sin(angle) * d + pY * wave;
        webCtx.lineTo(ptX, ptY);
      }
      webCtx.lineTo(currentX, currentY);
      webCtx.stroke();
    });
    
    // Web splatter/impact
    if (w.progress >= 1) {
      webCtx.fillStyle = `rgba(255, 255, 255, ${w.opacity})`;
      webCtx.beginPath();
      webCtx.arc(w.targetX, w.targetY, 4 + Math.random() * 3, 0, Math.PI * 2);
      webCtx.fill();
      
      // Draw small splatter dots
      for(let j=0; j<3; j++) {
        webCtx.beginPath();
        webCtx.arc(w.targetX + (Math.random()-0.5)*15, w.targetY + (Math.random()-0.5)*15, Math.random()*2 + 1, 0, Math.PI * 2);
        webCtx.fill();
      }
    }
  }
  requestAnimationFrame(drawWebs);
}
drawWebs();

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

let trailX = window.innerWidth / 2;
let trailY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  setTimeout(() => {
    const dx = e.clientX - trailX;
    const dy = e.clientY - trailY;
    
    // Only rotate if there's enough movement to prevent jitter
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const rotation = angle + 90; // Spider graphic points UP, so +90 to align with movement
      trail.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    }
    
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    
    trailX = e.clientX;
    trailY = e.clientY;
  }, 50);
});

// Interactive elements trigger cursor change
document.querySelectorAll('a, button, .action-btn, .s-large').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// ── PARALLAX EFFECT & DYNAMIC HALFTONE ──
document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  
  // Dynamic Halftone CSS vars
  document.documentElement.style.setProperty('--mouseX', `${e.clientX * 0.05}px`);
  document.documentElement.style.setProperty('--mouseY', `${e.clientY * 0.05}px`);
  
  document.querySelectorAll('.parallax-layer').forEach(layer => {
    const speed = layer.getAttribute('data-speed') || 1;
    const x = mouseX * 20 * speed;
    const y = mouseY * 20 * speed;
    layer.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// ── PHASE MANAGEMENT ──
const P1 = document.getElementById('phase1');
const P2 = document.getElementById('phase2');
const P3 = document.getElementById('phase3');

// ── CANVAS DEV-VERSE (PHASE 1) ──
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], animFrame;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initNodes();
}
window.addEventListener('resize', resizeCanvas);

function initNodes() {
  nodes = [];
  const cx = W / 2;
  const cy = H / 2;
  
  // The Anomaly (Ronit)
  nodes.push({ x: cx, y: cy, r: 15, isTarget: true, vx: 0, vy: 0, baseX: cx, baseY: cy });
  
  // Normal Devs
  for(let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (Math.min(W,H) / 2.5) + 50;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    nodes.push({ x, y, r: 6, isTarget: false, vx: 0, vy: 0, baseX: x, baseY: y });
  }
}

function drawCanvas(time) {
  ctx.clearRect(0, 0, W, H);
  
  // Draw connections (The Web)
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for(let i=0; i<nodes.length; i++) {
    for(let j=i+1; j<nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.hypot(dx, dy) < 150) {
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
      }
    }
  }
  ctx.stroke();

  // Draw nodes with floating physics
  nodes.forEach(n => {
    // Float animation
    n.x = n.baseX + Math.sin(time * 0.002 + n.baseX) * 10;
    n.y = n.baseY + Math.cos(time * 0.002 + n.baseY) * 10;

    if(n.isTarget) {
      // Glow and chromatic effect for Ronit
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FF004D';
      ctx.fillStyle = '#FFDE00';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + Math.sin(time*0.005)*3, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = '#222';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
    }
  });

  animFrame = requestAnimationFrame(drawCanvas);
}

resizeCanvas();
drawCanvas(0);

// Canvas Click Logic
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  
  let foundTarget = false;
  
  for(let n of nodes) {
    if(Math.hypot(mx - n.x, my - n.y) < n.r + 20) {
      if(n.isTarget) {
        foundTarget = true;
        initiateJump();
      } else {
        const msg = document.getElementById('notHimMsg');
        msg.style.display = 'block';
        msg.style.top = e.clientY + 'px';
        msg.style.left = e.clientX + 'px';
        setTimeout(() => msg.style.display = 'none', 1000);
      }
      break;
    }
  }
});

// ── HYPER-SPACE JUMP (PHASE 2) ──
function initiateJump() {
  cancelAnimationFrame(animFrame);
  document.getElementById('foundMsg').style.display = 'block';
  
  // Suck into portal effect
  gsap.to(canvas, { scale: 5, opacity: 0, duration: 1, ease: "power4.in" });
  gsap.to(document.getElementById('dvIntro'), { scale: 0, opacity: 0, duration: 0.5 });
  
  setTimeout(() => {
    P1.classList.add('hidden');
    P2.classList.remove('hidden');
    
    // Animate falling figure
    gsap.fromTo(".falling-figure", 
      { y: -500, scale: 0.5, rotation: -45 }, 
      { y: window.innerHeight, scale: 2, rotation: 45, duration: 1.2, ease: "power1.inOut" }
    );
    
    // Thwip text flash
    gsap.fromTo("#thwipText", 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.2, yoyo: true, repeat: 1, delay: 0.5 }
    );
    
    setTimeout(() => {
      P2.classList.add('hidden');
      initComicPortfolio();
    }, 1500);

  }, 1000);
}

// ── COMIC PORTFOLIO (PHASE 3) ──
function initComicPortfolio() {
  P3.classList.remove('hidden');
  window.scrollTo(0,0);
  
  // Snappy, frame-by-frame style animation reveal for the panels
  const panels = gsap.utils.toArray('.panel');
  
  panels.forEach((panel, i) => {
    gsap.fromTo(panel, 
      { opacity: 0, y: 100, scale: 0.95 },
      { 
        opacity: 1, y: 0, scale: 1, 
        duration: 0.5, 
        ease: "back.out(1.7)", // Comic book SNAP effect
        scrollTrigger: {
          trigger: panel,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
  
  // Animate skill tags popping in
  gsap.fromTo(".sk-tag", 
    { scale: 0, rotation: () => Math.random() * 40 - 20 },
    { 
      scale: 1, rotation: 0, 
      stagger: 0.1, 
      duration: 0.4, 
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: ".skill-cloud",
        start: "top 80%"
      }
    }
  );

  // Skill Interaction
  const skills = document.querySelectorAll('.sk-tag');
  const missions = document.querySelectorAll('.panel-mission');
  
  skills.forEach(skill => {
    skill.addEventListener('mouseenter', () => {
      const skillName = skill.getAttribute('data-skill');
      if (!skillName) return;
      
      missions.forEach(mission => {
        const missionSkills = mission.getAttribute('data-skills');
        if (missionSkills && missionSkills.includes(skillName)) {
          mission.classList.add('highlight');
          mission.classList.remove('dimmed');
        } else {
          mission.classList.add('dimmed');
          mission.classList.remove('highlight');
        }
      });
    });
    
    skill.addEventListener('mouseleave', () => {
      missions.forEach(mission => {
        mission.classList.remove('highlight', 'dimmed');
      });
    });
  });

  // SFX text pops
  gsap.utils.toArray('.sfx-text').forEach(sfx => {
    gsap.fromTo(sfx, 
      { scale: 0, opacity: 0 },
      { 
        scale: 1.2, opacity: 1, 
        duration: 0.3, 
        ease: "rough({ template: power0.none, strength: 1, points: 20, taper: none, randomize: true, clamp: false })",
        scrollTrigger: {
          trigger: sfx,
          start: "top 70%"
        }
      }
    );
  });
}

function handleForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('senderName').value;
  const email = document.getElementById('senderEmail').value;
  const mission = document.getElementById('senderMission').value;
  
  const phone = "919319333635"; // Your WhatsApp number
  const message = `*NEW MISSION ALERT!*\n\n*Name:* ${name}\n*Email:* ${email}\n*Mission Details:*\n${mission}`;
  const encodedMessage = encodeURIComponent(message);
  
  // Open WhatsApp in a new tab
  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  
  const btn = document.getElementById('formBtn');
  btn.textContent = "BAM! SENT!";
  btn.style.background = "var(--cyan)";
  btn.style.color = "var(--ink)";
  btn.style.transform = "rotate(3deg) scale(1.1)";
  
  setTimeout(() => {
    btn.textContent = "THWIP IT 🕸";
    btn.style.background = "";
    btn.style.color = "";
    btn.style.transform = "";
    e.target.reset();
  }, 2500);
}

// ── 3D COMIC PANEL TILT ──
document.querySelectorAll('.panel').forEach(panel => {
  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Divide by a dampening factor (increased from 20 to 60 to reduce tilt)
    const rotateX = ((y - centerY) / 60) * -1;
    const rotateY = (x - centerX) / 60;
    
    // Add translateY(-5px) to lift the panel towards the user
    panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-5px)`;
    panel.style.boxShadow = `15px 15px 0 var(--cyan), -8px -8px 0 var(--red)`;
  });
  
  panel.addEventListener('mouseleave', () => {
    panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)`;
    panel.style.boxShadow = ``;
  });
});

// ── SPIDERMAN MASK EFFECT ──
const heroMaskContainer = document.getElementById('heroMaskContainer');
if (heroMaskContainer) {
  heroMaskContainer.addEventListener('mousemove', (e) => {
    const rect = heroMaskContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroMaskContainer.style.setProperty('--maskX', `${x}px`);
    heroMaskContainer.style.setProperty('--maskY', `${y}px`);
  });
}

// ── SPIDER-SENSE TEXT GLITCH (SCRAMBLE) ──
const chars = '!<>-_\\/[]{}—=+*^?#_';
document.querySelectorAll('.glitch-text, .mission-badge, .mega-text').forEach(el => {
  const originalText = el.getAttribute('data-text') || el.innerText;
  
  el.addEventListener('mouseenter', () => {
    let iteration = 0;
    clearInterval(el.interval);
    
    el.interval = setInterval(() => {
      el.innerText = originalText
        .split('')
        .map((letter, index) => {
          if(index < iteration) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if(iteration >= originalText.length){ 
        clearInterval(el.interval);
        // Reset data-text for CSS ::before/::after glitches if applicable
        if(el.classList.contains('glitch-text')) el.setAttribute('data-text', originalText);
      }
      
      iteration += 1 / 3; // Speed of decoding
    }, 30);
  });
});