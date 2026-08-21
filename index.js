/* =====================================================
   VIVEK KUMAR — PORTFOLIO MAIN SCRIPT
   - Page loader
   - Custom cursor
   - Sticky nav + mobile drawer
   - Three.js 3D animated hero model
   - Typewriter
   - Scroll reveal (IntersectionObserver)
   - Skill bar animation
   - Contact form
   - Back-to-top
===================================================== */

/* ─────────────────────────────────────
   PAGE LOADER
───────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
  }, 1500);
});

/* ─────────────────────────────────────
   YEAR
───────────────────────────────────── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ─────────────────────────────────────
   CUSTOM CURSOR  (dot + lagging ring)
───────────────────────────────────── */
const cursorEl = document.getElementById('cursor');
const cDot     = document.getElementById('cDot');
const cRing    = document.getElementById('cRing');
let mx = 0, my = 0, rx = 0, ry = 0, cursorReady = false;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (!cursorReady) {
    cursorReady = true;
    cursorEl.style.opacity = '1';
  }
});

(function loopCursor() {
  cDot.style.left  = mx + 'px';
  cDot.style.top   = my + 'px';
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cRing.style.left = rx + 'px';
  cRing.style.top  = ry + 'px';
  requestAnimationFrame(loopCursor);
})();

document.querySelectorAll('a, button, .pcard, .feat, .info-card, .chip, .skill-bar')
  .forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('on-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('on-link'));
  });

/* ─────────────────────────────────────
   STICKY NAV
───────────────────────────────────── */
const navEl = document.getElementById('nav');
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  navEl.classList.toggle('sticky', window.scrollY > 60);
  toTop.classList.toggle('show',   window.scrollY > 400);
}, { passive: true });

/* ─────────────────────────────────────
   MOBILE DRAWER
───────────────────────────────────── */
const hamBtn = document.getElementById('hamBtn');
const drawer = document.getElementById('drawer');

function closeDrawer() {
  hamBtn.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

hamBtn.addEventListener('click', () => {
  const isOpen = hamBtn.classList.toggle('open');
  drawer.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ─────────────────────────────────────
   TYPEWRITER
───────────────────────────────────── */
const typeWords = ['React Developer','UI/UX Builder','JavaScript Dev','Responsive Designer','Creative Coder'];
let twIdx = 0, twChar = 0, twDel = false;
const typeEl = document.getElementById('typeRole');

function typeLoop() {
  const word = typeWords[twIdx];
  if (!twDel) {
    typeEl.textContent = word.slice(0, ++twChar);
    if (twChar === word.length) { twDel = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typeEl.textContent = word.slice(0, --twChar);
    if (twChar === 0) { twDel = false; twIdx = (twIdx + 1) % typeWords.length; }
  }
  setTimeout(typeLoop, twDel ? 52 : 90);
}
typeLoop();

/* ─────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      if (entry.target.classList.contains('skills')) animateBars();
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-x, .stagger').forEach(el => {
  revealObserver.observe(el);
});

/* ─────────────────────────────────────
   SKILL BARS
───────────────────────────────────── */
let barsAnimated = false;

function animateBars() {
  if (barsAnimated) return;
  barsAnimated = true;
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const fill = bar.querySelector('.skill-bar__fill');
    if (fill) setTimeout(() => { fill.style.width = bar.dataset.pct + '%'; }, 200);
  });
}

const barObserver = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) { animateBars(); barObserver.disconnect(); }
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar').forEach(b => barObserver.observe(b));

/* ─────────────────────────────────────
   CONTACT FORM
───────────────────────────────────── */
const cForm = document.getElementById('cForm');
if (cForm) {
  cForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn   = document.getElementById('fBtn');
    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg   = document.getElementById('fmsg').value.trim();

    if (!name || !email || !msg) {
      btn.textContent = 'Please fill all required fields!';
      btn.style.background = '#e53e3e';
      setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 2200);
      return;
    }

    const orig = btn.textContent;
    btn.disabled = true;
    btn.classList.add('sent');
    btn.textContent = '✓ Message Sent!';
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove('sent');
      btn.textContent = orig;
      cForm.reset();
    }, 3500);
  });
}

/* ─────────────────────────────────────
   THREE.JS  3D HERO SCENE
   Animated floating developer figure
───────────────────────────────────── */
(function initThreeScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  if (typeof THREE === 'undefined') return;

  const W = canvas.clientWidth  || 560;
  const H = canvas.clientHeight || 560;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
  camera.position.set(0, 0.4, 7.0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  /* Materials */
  const amber    = 0xf59e0b;
  const amber2   = 0xfbbf24;
  const skin     = 0xe2b08a;
  const darksuit = 0x1a1610;
  const darksuit2= 0x252018;
  const screenBg = 0x060c1a;

  const mSuit    = new THREE.MeshStandardMaterial({ color:darksuit,  metalness:.15, roughness:.6 });
  const mSuit2   = new THREE.MeshStandardMaterial({ color:darksuit2, metalness:.15, roughness:.6 });
  const mSkin    = new THREE.MeshStandardMaterial({ color:skin,      metalness:0,   roughness:.8 });
  const mAmber   = new THREE.MeshStandardMaterial({ color:amber,     metalness:.2,  roughness:.4 });
  const mGlow    = new THREE.MeshStandardMaterial({ color:amber, emissive:amber, emissiveIntensity:.8, metalness:0, roughness:1 });
  const mScreen  = new THREE.MeshStandardMaterial({ color:screenBg, emissive:0x0a1f4a, emissiveIntensity:.7 });
  const mCode1   = new THREE.MeshStandardMaterial({ color:amber,   emissive:amber,   emissiveIntensity:1.2 });
  const mCode2   = new THREE.MeshStandardMaterial({ color:0x60a5fa,emissive:0x60a5fa,emissiveIntensity:.9 });
  const mCode3   = new THREE.MeshStandardMaterial({ color:0x86efac,emissive:0x86efac,emissiveIntensity:.7 });

  const group = new THREE.Group();
  scene.add(group);

  function capsule(rx, len, mat, px, py, pz, rx2=0, rz2=0) {
    const geo = new THREE.CylinderGeometry(rx, rx, len, 14);
    const m   = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.rotation.x = rx2; m.rotation.z = rz2;
    m.castShadow = true;
    group.add(m);
    return m;
  }
  function sphere(r, mat, px, py, pz) {
    const geo = new THREE.SphereGeometry(r, 20, 20);
    const m   = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.castShadow = true;
    group.add(m);
    return m;
  }
  function box(w,h,d, mat, px,py,pz, rx2=0,ry2=0) {
    const geo = new THREE.BoxGeometry(w,h,d);
    const m   = new THREE.Mesh(geo, mat);
    m.position.set(px,py,pz);
    m.rotation.x=rx2; m.rotation.y=ry2;
    m.castShadow=true;
    group.add(m);
    return m;
  }

  /* Torso */
  capsule(.48,.95, mSuit,  0, 0, 0);
  /* Chest pocket amber stripe */
  box(.35,.04,.04, mAmber, -.18, .28, .45);

  /* Neck */
  capsule(.14,.22, mSkin,  0, .65, 0);

  /* Head */
  const head = sphere(.40, mSkin, 0, 1.1, 0);

  /* Hair */
  const hairGeo = new THREE.SphereGeometry(.43, 20, 20, 0, Math.PI*2, 0, Math.PI*.48);
  const hairMesh = new THREE.Mesh(hairGeo, mSuit2);
  hairMesh.position.set(0, 1.1, 0);
  group.add(hairMesh);

  /* Eyes */
  [-1,1].forEach(s => {
    sphere(.066, mSuit, s*.16, 1.14, .36);
    /* Amber iris glow */
    const ig = new THREE.Mesh(new THREE.SphereGeometry(.03,8,8), mGlow);
    ig.position.set(s*.16, 1.14, .42);
    group.add(ig);
  });

  /* Shoulders */
  [-1,1].forEach(s => { sphere(.2, mSuit, s*.66, .26, 0); });

  /* Upper arms */
  [-1,1].forEach(s => capsule(.13,.55, mSuit, s*.78, -.1, 0, 0, s*.28));

  /* Forearms + hands (bent forward, holding laptop) */
  [-1,1].forEach(s => {
    capsule(.11,.50, mSkin, s*1.0, -.58, .22, -.35, s*.1);
    sphere(.115, mSkin, s*1.0, -.86, .44);
  });

  /* Laptop base */
  const lapBase = box(1.5,.07,1.0, mSuit2, 0,-.95,.22);

  /* Laptop lid pivot */
  const screenPivot = new THREE.Group();
  screenPivot.position.set(0, -.89, -.28);
  screenPivot.rotation.x = -1.95;
  group.add(screenPivot);

  const lidFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5,.07,1.0), mSuit2);
  lidFrame.position.set(0, 0, .5);
  screenPivot.add(lidFrame);

  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.35,.85), mScreen);
  screenMesh.position.set(0, .05, .5);
  screenPivot.add(screenMesh);

  /* Code lines on screen */
  const codeLines = [
    { w:.72, mat:mCode1, y:.3  },
    { w:.55, mat:mCode2, y:.2  },
    { w:.85, mat:mCode3, y:.1  },
    { w:.42, mat:mCode1, y:0   },
    { w:.68, mat:mCode2, y:-.1 },
    { w:.35, mat:mCode3, y:-.2 },
    { w:.78, mat:mCode1, y:-.3 },
  ];
  codeLines.forEach(cl => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(cl.w,.038), cl.mat);
    plane.position.set(-((.65-cl.w*.5)), cl.y + .05, .51);
    screenPivot.add(plane);
  });

  /* Screen glow light */
  const screenLight = new THREE.PointLight(0x1a4a8a, 2, 2.5);
  screenLight.position.set(0, -.3, .9);
  group.add(screenLight);

  /* Floating particles */
  const pCount = 100;
  const pPos   = new Float32Array(pCount * 3);
  const pCol   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.8 + Math.random() * 1.8;
    pPos[i*3]   = Math.cos(a)*r;
    pPos[i*3+1] = (Math.random()-.5)*4;
    pPos[i*3+2] = Math.sin(a)*r;
    const t = Math.random();
    pCol[i*3]   = .96; pCol[i*3+1] = .62+t*.35; pCol[i*3+2] = .04+t*.92;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol,3));
  const pMat = new THREE.PointsMaterial({ size:.032, vertexColors:true, transparent:true, opacity:.7, sizeAttenuation:true });
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);

  /* Orbit rings */
  function addRing(radius, tube, color, opacity, rx, ry) {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 6, 90),
      new THREE.MeshBasicMaterial({ color, transparent:true, opacity })
    );
    m.rotation.x=rx; m.rotation.y=ry; scene.add(m); return m;
  }
  const ring1 = addRing(2.2, .007, amber,  .16,  Math.PI/5, 0);
  const ring2 = addRing(1.8, .005, amber2, .10, -Math.PI/4, Math.PI/6);

  /* Floating accent shapes */
  const accents = [
    { geo:new THREE.OctahedronGeometry(.11), pos:[2.0, 1.2, .4],  speed:1.2 },
    { geo:new THREE.TetrahedronGeometry(.09),pos:[-1.9,.5,1.0],   speed:.8  },
    { geo:new THREE.OctahedronGeometry(.08), pos:[1.5,-1.0,.9],   speed:1.5 },
    { geo:new THREE.BoxGeometry(.09,.09,.09),pos:[-1.3,-1.3,-.4], speed:1.0 },
  ].map(d => {
    const m = new THREE.Mesh(d.geo, mGlow.clone());
    m.position.set(...d.pos);
    m.userData = { speed:d.speed, origin:[...d.pos] };
    scene.add(m); return m;
  });

  /* Lights */
  scene.add(new THREE.AmbientLight(0xffffff, .45));

  const key = new THREE.DirectionalLight(0xfaf7f2, 1.2);
  key.position.set(3,4,3); key.castShadow=true; scene.add(key);

  const fill = new THREE.PointLight(amber, 1.8, 9);
  fill.position.set(-2.5,1.5,2); scene.add(fill);

  const rim = new THREE.PointLight(0x60a5fa, 1.2, 7);
  rim.position.set(2,-1,-2); scene.add(rim);

  /* Mouse parallax */
  let tRotX=0,tRotY=0,cRotX=0,cRotY=0;
  document.addEventListener('mousemove', e => {
    tRotY = (e.clientX/window.innerWidth  - .5) * .5;
    tRotX = (e.clientY/window.innerHeight - .5) * -.3;
  });

  /* Animation loop */
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    cRotX += (tRotX - cRotX) * .05;
    cRotY += (tRotY - cRotY) * .05;

    group.position.y  = Math.sin(t*.65) * .08;
    group.rotation.y  = cRotY + Math.sin(t*.4) * .05;
    group.rotation.x  = cRotX;

    ring1.rotation.z += .0025;
    ring2.rotation.z -= .0018;
    particles.rotation.y += .0015;

    accents.forEach((a,i) => {
      a.position.y = a.userData.origin[1] + Math.sin(t*a.userData.speed + i) * .18;
      a.rotation.x += .01*a.userData.speed;
      a.rotation.z += .008*a.userData.speed;
    });

    screenLight.intensity = 1.6 + Math.sin(t*1.4) * .35;
    renderer.render(scene, camera);
  }
  animate();

  /* Resize */
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
})();