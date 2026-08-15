/* ============ Theme ============ */
const htmlEl = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('theme') || 'dark';

htmlEl.setAttribute('data-theme', savedTheme);

if (themeIcon) {
  themeIcon.className = savedTheme === 'dark'
    ? 'ti ti-moon'
    : 'ti ti-sun';
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    htmlEl.setAttribute('data-theme', next);

    if (themeIcon) {
      themeIcon.className = next === 'dark'
        ? 'ti ti-moon'
        : 'ti ti-sun';
    }

    localStorage.setItem('theme', next);

    window.dispatchEvent(
      new CustomEvent('sitethemechange', {
        detail: { theme: next }
      })
    );
  });
}


/* ============ Scroll progress + back-to-top ============ */
const bar = document.getElementById('progress-bar');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const scrollableHeight = document.body.scrollHeight - window.innerHeight;

  if (scrollableHeight > 0 && bar) {
    const pct = (window.scrollY / scrollableHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }

  if (backTop) {
    backTop.classList.toggle('show', window.scrollY > 400);
  }
}, { passive: true });

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


/* ============ Cursor glow (desktop) ============ */
const glow = document.getElementById('cursor-glow');

if (glow) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}


/* ============ Terminal typing animation ============ */
const phrases = [
  'Building with C++ & Python',
  'Exploring Generative AI',
  'Competitive programmer',
  'Event organizer & leader'
];

let pi = 0;
let ci = 0;
let deleting = false;

const typedEl = document.getElementById('typed');

function type() {
  if (!typedEl) return;

  const p = phrases[pi];

  if (!deleting) {
    ci++;
    typedEl.textContent = p.slice(0, ci);

    if (ci === p.length) {
      deleting = true;
      setTimeout(type, 1900);
      return;
    }
  } else {
    ci--;
    typedEl.textContent = p.slice(0, ci);

    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;

      setTimeout(type, 400);
      return;
    }
  }

  setTimeout(type, deleting ? 35 : 65);
}

type();


/* ============ Filter tabs (--flags) ============ */
function filterSection(tab, el) {
  document.querySelectorAll('.pill').forEach(p => {
    p.classList.remove('active');
  });

  if (el) {
    el.classList.add('active');
  }

  ['experience', 'projects', 'skills', 'education', 'certifications']
    .forEach(id => {
      const s = document.getElementById(id);

      if (s) {
        s.style.display = (tab === 'all' || tab === id)
          ? ''
          : 'none';
      }
    });
}

window.filterSection = filterSection;


/* ============ Scroll spy for editor tabs ============ */
const navTabs = document.querySelectorAll('.nav-tab');

const spySections = [
  'top',
  'experience',
  'projects',
  'skills',
  'contact'
]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const spyObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navTabs.forEach(t => {
      t.classList.toggle(
        'active',
        t.dataset.target === entry.target.id
      );
    });
  });
}, {
  rootMargin: '-40% 0px -50% 0px',
  threshold: 0
});

spySections.forEach(section => {
  spyObs.observe(section);
});


/* ============ Scroll reveal ============ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;

    e.target.classList.add('visible');
    revealObs.unobserve(e.target);
  });
}, {
  threshold: 0.1
});

document
  .querySelectorAll('.reveal, .stagger')
  .forEach(el => revealObs.observe(el));


/* ============ Counters (stats.json) ============ */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;

    const el = e.target;
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isString = el.classList.contains('tok-str');

    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));

    const t = setInterval(() => {
      cur = Math.min(cur + step, target);

      const val = cur + suffix;
      el.textContent = isString ? `"${val}"` : val;

      if (cur >= target) {
        clearInterval(t);
      }
    }, 28);

    countObs.unobserve(el);
  });
}, {
  threshold: 0.4
});

document
  .querySelectorAll('[data-count]')
  .forEach(el => countObs.observe(el));


/* ============ Proficiency bars ============ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;

    e.target.style.width = e.target.dataset.width + '%';
    barObs.unobserve(e.target);
  });
}, {
  threshold: 0.3
});

document
  .querySelectorAll('.prof-fill')
  .forEach(el => barObs.observe(el));


/* ============ Hero 3D scene — low-poly dev desk diorama ============ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const heroEl = document.querySelector('.hero-bg-full');

  if (!canvas || !heroEl || typeof THREE === 'undefined') {
    return;
  }

  const reduceMotion = window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

  let W = heroEl.clientWidth;
  let H = heroEl.clientHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    42,
    W / H,
    0.1,
    100
  );

  camera.position.set(2.7, 2.0, 4.8);
  camera.lookAt(0.3, 1.05, 0.1);

  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
  } catch (e) {
    return;
  }

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setSize(W, H);


  // These accents stay the same in both themes.
  const AMBER = 0xe3a64b;
  const GREEN = 0x52d78a;
  const BLUE = 0x6fa8f5;


  const PALETTE = {
    dark: {
      fog: 0x0d0f18,
      fogNear: 7,
      fogFar: 15,

      wallBack: 0x1c2033,
      wallSide: 0x262c46,
      floor: 0x181b28,

      desk: 0xcfccdc,
      deskDark: 0x272b40,

      ambientColor: 0x3a4066,
      ambientIntensity: 1.05,

      keyIntensity: 1.15,
      fillIntensity: 0.55,

      washOpacity: 0.32,
      glowOpacity: 0.5,
      canvasOpacity: 0.92
    },

    light: {
      fog: 0xf4f5f8,
      fogNear: 7,
      fogFar: 15,

      wallBack: 0xeceef3,
      wallSide: 0xe1e3ea,
      floor: 0xe7e8ee,

      desk: 0xffffff,
      deskDark: 0x3a3f55,

      ambientColor: 0xffffff,
      ambientIntensity: 1.5,

      keyIntensity: 0.55,
      fillIntensity: 0.35,

      washOpacity: 0.12,
      glowOpacity: 0.3,
      canvasOpacity: 0.75
    }
  };


  /* ---------- Helpers ---------- */

  function lit(color, opts) {
    return new THREE.MeshLambertMaterial({
      color,
      flatShading: true,
      ...(opts || {})
    });
  }

  function glow(color, opts) {
    return new THREE.MeshBasicMaterial({
      color,
      ...(opts || {})
    });
  }

  function mesh(geo, mat, x, y, z, ry) {
    const m = new THREE.Mesh(geo, mat);

    m.position.set(x, y, z);

    if (ry) {
      m.rotation.y = ry;
    }

    return m;
  }

  function glowSprite(colorHex, size, x, y, z, opacity) {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;

    const ctx = c.getContext('2d');

    if (!ctx) {
      return new THREE.Sprite();
    }

    const grad = ctx.createRadialGradient(
      64,
      64,
      0,
      64,
      64,
      64
    );

    const hex = '#' + colorHex
      .toString(16)
      .padStart(6, '0');

    grad.addColorStop(0, hex);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(c);

    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const spr = new THREE.Sprite(mat);

    spr.scale.set(size, size, 1);
    spr.position.set(x, y, z);

    return spr;
  }

  function shadowBlob(size, x, y, z) {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;

    const ctx = c.getContext('2d');

    if (!ctx) {
      return new THREE.Mesh();
    }

    const grad = ctx.createRadialGradient(
      32,
      32,
      0,
      32,
      32,
      32
    );

    grad.addColorStop(0, 'rgba(0,0,0,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(c);

    const geo = new THREE.PlaneGeometry(
      size,
      size * 0.5
    );

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false
    });

    const m = new THREE.Mesh(geo, mat);

    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y + 0.01, z);

    return m;
  }

  function codeScreenTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 160;

    const ctx = c.getContext('2d');

    if (!ctx) {
      return new THREE.CanvasTexture(c);
    }

    ctx.fillStyle = '#0a0c11';
    ctx.fillRect(0, 0, 256, 160);

    const rows = [
      ['#6fa8f5', 30],
      ['#52d78a', 90],
      ['#e3a64b', 60],
      ['#6fa8f5', 100],
      ['#8991a5', 45],
      ['#52d78a', 75],
      ['#e3a64b', 40],
      ['#6fa8f5', 85],
      ['#52d78a', 55],
      ['#8991a5', 95]
    ];

    let y = 14;

    rows.forEach(([col, w]) => {
      ctx.fillStyle = col;
      ctx.fillRect(16, y, w, 6);
      y += 15;
    });

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;

    return tex;
  }


  /* ---------- Scene setup ---------- */

  // Floor = 0, desk top = 0.78.
  const FLOOR_Y = 0;
  const DESK_TOP_Y = 0.78;

  scene.fog = new THREE.Fog(
    PALETTE.dark.fog,
    PALETTE.dark.fogNear,
    PALETTE.dark.fogFar
  );

  const root = new THREE.Group();

  root.rotation.y = -0.22;
  scene.add(root);


  /* ---------- Room shell ---------- */

  const wallBackMat = lit(PALETTE.dark.wallBack);
  const wallSideMat = lit(PALETTE.dark.wallSide);
  const floorMat = lit(PALETTE.dark.floor);

  root.add(
    mesh(
      new THREE.PlaneGeometry(16, 9),
      wallBackMat,
      0.2,
      3.2,
      -3
    )
  );

  root.add(
    mesh(
      new THREE.PlaneGeometry(11, 9),
      wallSideMat,
      6,
      3.2,
      2,
      -Math.PI / 2
    )
  );

  const floor = mesh(
    new THREE.PlaneGeometry(16, 11),
    floorMat,
    0.2,
    FLOOR_Y,
    2.2
  );

  floor.rotation.x = -Math.PI / 2;
  root.add(floor);

  root.add(
    shadowBlob(
      3.6,
      0.2,
      FLOOR_Y,
      0.6
    )
  );


  /* ---------- Desk ---------- */

  const desk = new THREE.Group();

  desk.position.set(0.2, 0, 0.3);
  root.add(desk);

  const deskTopMat = lit(PALETTE.dark.desk);
  const deskLegMat = lit(PALETTE.dark.deskDark);

  desk.add(
    mesh(
      new THREE.BoxGeometry(3.4, 0.08, 1.5),
      deskTopMat,
      0,
      DESK_TOP_Y - 0.04,
      0
    )
  );

  const legH = DESK_TOP_Y - 0.08;

  [
    [-1.5, -0.55],
    [1.5, -0.55],
    [-1.5, 0.55],
    [1.5, 0.55]
  ].forEach(([x, z]) => {
    desk.add(
      mesh(
        new THREE.BoxGeometry(0.09, legH, 0.09),
        deskLegMat,
        x,
        legH / 2,
        z
      )
    );
  });


  /* ---------- Monitor ---------- */

  const monitor = new THREE.Group();

  monitor.position.set(
    -0.35,
    DESK_TOP_Y,
    -0.25
  );

  desk.add(monitor);

  const monitorMat = lit(PALETTE.dark.deskDark);

  monitor.add(
    mesh(
      new THREE.BoxGeometry(0.22, 0.04, 0.16),
      monitorMat,
      0,
      0,
      0
    )
  );

  monitor.add(
    mesh(
      new THREE.BoxGeometry(0.05, 0.32, 0.05),
      monitorMat,
      0,
      0.2,
      0
    )
  );

  monitor.add(
    mesh(
      new THREE.BoxGeometry(1.15, 0.68, 0.05),
      monitorMat,
      0,
      0.62,
      -0.02
    )
  );

  const screenTex = codeScreenTexture();

  const screen = mesh(
    new THREE.PlaneGeometry(1.02, 0.56),
    new THREE.MeshBasicMaterial({
      map: screenTex
    }),
    0,
    0.62,
    0.01
  );

  monitor.add(screen);

  const screenWash = glowSprite(
    BLUE,
    2,
    -0.35,
    DESK_TOP_Y + 0.62,
    0.05,
    PALETTE.dark.glowOpacity
  );

  desk.add(screenWash);


  /* ---------- Keyboard + mouse ---------- */

  desk.add(
    mesh(
      new THREE.BoxGeometry(0.85, 0.03, 0.28),
      monitorMat,
      -0.35,
      DESK_TOP_Y + 0.015,
      0.4
    )
  );

  desk.add(
    mesh(
      new THREE.BoxGeometry(0.14, 0.03, 0.2),
      monitorMat,
      0.25,
      DESK_TOP_Y + 0.015,
      0.42
    )
  );


  /* ---------- PC tower ---------- */

  const tower = new THREE.Group();
  const caseH = 1.05;

  tower.position.set(
    1.35,
    DESK_TOP_Y + caseH / 2,
    -0.15
  );

  desk.add(tower);

  const caseMat = lit(PALETTE.dark.deskDark);

  tower.add(
    mesh(
      new THREE.BoxGeometry(0.55, caseH, 0.85),
      caseMat,
      0,
      0,
      0
    )
  );

  const fanGeo = new THREE.CylinderGeometry(
    0.12,
    0.12,
    0.02,
    20
  );

  const fanColors = [GREEN, BLUE, GREEN];

  const fanMeshes = fanColors.map((c, i) => {
    const f = mesh(
      fanGeo,
      glow(c),
      0.28,
      -0.32 + i * 0.32,
      0
    );

    f.rotation.z = Math.PI / 2;
    tower.add(f);

    return f;
  });

  const towerWashA = glowSprite(
    GREEN,
    1.7,
    1.65,
    DESK_TOP_Y + caseH / 2,
    0,
    PALETTE.dark.glowOpacity
  );

  const towerWashB = glowSprite(
    BLUE,
    1.3,
    1.65,
    DESK_TOP_Y + caseH / 2 - 0.32,
    0,
    PALETTE.dark.glowOpacity * 0.8
  );

  desk.add(towerWashA, towerWashB);


  /* ---------- Mug, notebook, pen holder ---------- */

  desk.add(
    mesh(
      new THREE.CylinderGeometry(
        0.09,
        0.08,
        0.14,
        14
      ),
      deskLegMat,
      0.75,
      DESK_TOP_Y + 0.07,
      0.45
    )
  );

  const notebookMat = lit(0x6a5fb0);

  desk.add(
    mesh(
      new THREE.BoxGeometry(0.34, 0.02, 0.24),
      notebookMat,
      -1.15,
      DESK_TOP_Y + 0.01,
      0.42
    )
  );

  desk.add(
    mesh(
      new THREE.CylinderGeometry(
        0.045,
        0.05,
        0.14,
        10
      ),
      deskLegMat,
      -1.35,
      DESK_TOP_Y + 0.07,
      0.1
    )
  );


  /* ---------- Plant ---------- */

  const plant = new THREE.Group();

  plant.position.set(
    -1.7,
    FLOOR_Y,
    0.9
  );

  root.add(plant);

  plant.add(
    mesh(
      new THREE.CylinderGeometry(
        0.16,
        0.13,
        0.24,
        12
      ),
      deskLegMat,
      0,
      0.12,
      0
    )
  );

  const leafMat = lit(0x2f6b4a);
  const leafGeo = new THREE.IcosahedronGeometry(
    0.22,
    0
  );

  [
    [0, 0.5, 0],
    [0.18, 0.42, 0.1],
    [-0.16, 0.4, -0.12],
    [0.05, 0.62, -0.1]
  ].forEach(([x, y, z]) => {
    const leaf = mesh(
      leafGeo,
      leafMat,
      x,
      y,
      z
    );

    leaf.scale.set(1, 1.3, 0.7);
    plant.add(leaf);
  });

  root.add(
    shadowBlob(
      1.4,
      -1.7,
      FLOOR_Y,
      0.9
    )
  );


  /* ---------- Ambient wall wash ---------- */

  const wallWash = glowSprite(
    AMBER,
    5,
    -0.4,
    3.6,
    -2.5,
    PALETTE.dark.washOpacity
  );

  root.add(wallWash);


  /* ---------- Lights ---------- */

  const ambient = new THREE.AmbientLight(
    PALETTE.dark.ambientColor,
    PALETTE.dark.ambientIntensity
  );

  scene.add(ambient);

  const key = new THREE.PointLight(
    AMBER,
    PALETTE.dark.keyIntensity,
    12
  );

  key.position.set(-0.3, 3.6, 1.5);
  scene.add(key);

  const fill = new THREE.PointLight(
    0x5a6690,
    PALETTE.dark.fillIntensity,
    12
  );

  fill.position.set(3, 1.8, 3);
  scene.add(fill);

  const fanGlowLight = new THREE.PointLight(
    GREEN,
    0.8,
    3
  );

  fanGlowLight.position.set(
    1.75,
    DESK_TOP_Y + 0.4,
    0.3
  );

  scene.add(fanGlowLight);

  const screenLight = new THREE.PointLight(
    BLUE,
    0.55,
    2.4
  );

  screenLight.position.set(
    -0.35,
    DESK_TOP_Y + 0.62,
    0.4
  );

  scene.add(screenLight);


  /* ---------- Theme switching ---------- */

  function applyPalette(theme) {
    const p = theme === 'light'
      ? PALETTE.light
      : PALETTE.dark;

    scene.fog.color.setHex(p.fog);
    scene.fog.near = p.fogNear;
    scene.fog.far = p.fogFar;

    wallBackMat.color.setHex(p.wallBack);
    wallSideMat.color.setHex(p.wallSide);
    floorMat.color.setHex(p.floor);

    deskTopMat.color.setHex(p.desk);
    deskLegMat.color.setHex(p.deskDark);
    monitorMat.color.setHex(p.deskDark);
    caseMat.color.setHex(p.deskDark);

    ambient.color.setHex(p.ambientColor);
    ambient.intensity = p.ambientIntensity;

    key.intensity = p.keyIntensity;
    fill.intensity = p.fillIntensity;

    wallWash.material.opacity = p.washOpacity;

    screenWash.material.opacity = p.glowOpacity;
    towerWashA.material.opacity = p.glowOpacity;
    towerWashB.material.opacity = p.glowOpacity * 0.8;

    canvas.style.opacity = p.canvasOpacity;
  }

  applyPalette(
    document.documentElement.getAttribute('data-theme')
  );

  window.addEventListener(
    'sitethemechange',
    e => applyPalette(e.detail.theme)
  );


  /* ---------- Interaction + render loop ---------- */

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  const baseRotY = root.rotation.y;
  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      root.rotation.y =
        baseRotY +
        mouseX * 0.1 +
        Math.sin(t * 0.25) * 0.012;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();


  /* ---------- Resize ---------- */

  window.addEventListener('resize', () => {
    W = heroEl.clientWidth;
    H = heroEl.clientHeight;

    camera.aspect = W / H;
    camera.updateProjectionMatrix();

    renderer.setSize(W, H);
  });
})();