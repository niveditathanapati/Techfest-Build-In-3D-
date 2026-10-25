
/* =========================================================
   GLITCH ARCADE 2099 — INTERACTION ENGINE
   Three.js / UI controls / motion / terminal
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const state = {
    color: "pink",
    energy: 0.65,
    rotating: true,
    menuOpen: false,
    toastTimer: null,
    lastFrame: 0,
    frameCount: 0,
    fpsTime: 0
  };

  const palettes = {
    pink: {
      primary: 0xff38c7,
      secondary: 0xa855f7,
      glow: 0xff70dc
    },
    cyan: {
      primary: 0x43f5ff,
      secondary: 0x407bff,
      glow: 0x9dffff
    },
    gold: {
      primary: 0xffc857,
      secondary: 0xff7043,
      glow: 0xffe8a3
    },
    green: {
      primary: 0xb9ff66,
      secondary: 0x19dca0,
      glow: 0xe0ffac
    }
  };

  const projects = {
    orbit: {
      index: "SYS_001",
      title: "ORBITAL REALITY",
      description:
        "A spatial design experiment built around dimensional geometry, " +
        "reflective materials, luminous orbital paths, and responsive " +
        "motion. The concept demonstrates how a website can communicate " +
        "depth and atmosphere while keeping the interface understandable."
    },
    glitch: {
      index: "SYS_002",
      title: "GLITCH THEORY",
      description:
        "An exploration of digital distortion as a design language. " +
        "Layered color offsets, fragmented geometry, scanlines, and " +
        "animated typography establish a distinct visual identity without " +
        "making navigation or reading unnecessarily difficult."
    },
    neural: {
      index: "SYS_003",
      title: "NEURAL NETWORK",
      description:
        "A conceptual map of connected ideas. Nodes, luminous connections, " +
        "and flowing lines represent the relationship between interaction, " +
        "creative thinking, and the systems that power an immersive web " +
        "experience."
    }
  };

  /* -------------------------------------------------------
     UTILITIES
  ------------------------------------------------------- */

  function toast(message) {
    const element = $("#toast");
    if (!element) return;

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      element.classList.remove("show");
    }, 2800);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hexColor(value) {
    return `#${value.toString(16).padStart(6, "0")}`;
  }

  /* -------------------------------------------------------
     BOOT SEQUENCE
  ------------------------------------------------------- */

  function initBootSequence() {
    const screen = $("#bootScreen");
    const progress = $("#bootProgress");
    const status = $("#bootStatus");

    if (!screen) return;

    const messages = [
      "LOADING GRAPHICS ENGINE...",
      "CALIBRATING SPATIAL OBJECTS...",
      "CONNECTING INTERACTION MODULES...",
      "SYSTEM READY."
    ];

    let step = 0;

    const advance = () => {
      step++;

      if (progress) {
        progress.style.width = `${Math.min(step * 25, 100)}%`;
      }

      if (status) {
        status.textContent = messages[Math.min(step, messages.length - 1)];
      }

      if (step < 4) {
        setTimeout(advance, reducedMotion ? 30 : 190);
      } else {
        setTimeout(() => {
          screen.classList.add("is-hidden");
          document.body.classList.add("site-ready");

          setTimeout(() => {
            screen.remove();
          }, 700);
        }, reducedMotion ? 0 : 300);
      }
    };

    setTimeout(advance, reducedMotion ? 0 : 180);
  }

  /* -------------------------------------------------------
     HEADER + MOBILE NAVIGATION
  ------------------------------------------------------- */

  function initNavigation() {
    const header = $("#siteHeader");
    const menuToggle = $("#menuToggle");
    const nav = $("#mainNav");
    const navLinks = $$("#mainNav a");

    function closeMenu() {
      if (!nav || !menuToggle) return;

      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      state.menuOpen = false;
    }

    function updateHeader() {
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 80);
      }
    }

    window.addEventListener("scroll", updateHeader, {
      passive: true
    });

    updateHeader();

    if (menuToggle && nav) {
      menuToggle.addEventListener("click", () => {
        state.menuOpen = !state.menuOpen;

        nav.classList.toggle("is-open", state.menuOpen);
        menuToggle.setAttribute(
          "aria-expanded",
          String(state.menuOpen)
        );

        document.body.classList.toggle(
          "menu-open",
          state.menuOpen
        );
      });
    }

    navLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      if (
        state.menuOpen &&
        nav &&
        menuToggle &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* -------------------------------------------------------
     CUSTOM POINTER AURA
  ------------------------------------------------------- */

  function initPointerAura() {
    const aura = $("#cursorAura");

    if (!aura || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;

    window.addEventListener("pointermove", event => {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });

    function animateAura() {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;

      aura.style.left = `${x}px`;
      aura.style.top = `${y}px`;

      requestAnimationFrame(animateAura);
    }

    animateAura();
  }

  /* -------------------------------------------------------
     SCROLL REVEALS
  ------------------------------------------------------- */

  function initScrollReveal() {
    const elements = $$(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach(element => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.10,
      rootMargin: "0px 0px -35px 0px"
    });

    elements.forEach(element => observer.observe(element));
  }

  /* -------------------------------------------------------
     GLITCH TYPOGRAPHY
  ------------------------------------------------------- */

  function initGlitchTitle() {
    const title = $(".glitch-title");

    if (!title || reducedMotion) return;

    const triggerGlitch = () => {
      if (document.hidden) return;

      title.classList.remove("glitching");

      // Restart the CSS animation.
      void title.offsetWidth;

      title.classList.add("glitching");

      setTimeout(() => {
        title.classList.remove("glitching");
      }, 260);
    };

    setInterval(triggerGlitch, 5200);
  }

  /* -------------------------------------------------------
     THREE.JS — SHARED RENDERING
  ------------------------------------------------------- */

  const threeScenes = [];

  function createRenderer(container) {
    if (!container || !window.THREE) return null;

    try {
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.75)
      );

      renderer.setSize(
        Math.max(container.clientWidth, 1),
        Math.max(container.clientHeight, 1),
        false
      );

      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      renderer.domElement.setAttribute(
        "aria-hidden",
        "true"
      );

      container.replaceChildren(renderer.domElement);

      return renderer;
    } catch (error) {
      console.warn("WebGL renderer unavailable:", error);
      return null;
    }
  }

  function createScene(container, options = {}) {
    if (!container || !window.THREE) return null;

    const renderer = createRenderer(container);
    if (!renderer) return null;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      options.fov || 42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );

    camera.position.z = options.cameraZ || 5;

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(
      0xff38c7,
      3.0,
      30
    );
    keyLight.position.set(3, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(
      0x7c3aed,
      2.8,
      25
    );
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(
      0x43f5ff,
      2.1,
      20
    );
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const resize = () => {
      if (!container.isConnected) return;

      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const entry = {
      container,
      renderer,
      scene,
      camera,
      keyLight,
      fillLight,
      rimLight,
      resizeObserver,
      resize,
      update: null,
      pointerX: 0,
      pointerY: 0,
      targetX: 0,
      targetY: 0,
      elapsed: 0,
      disposed: false
    };

    container.addEventListener("pointermove", event => {
      const bounds = container.getBoundingClientRect();

      entry.targetX = (
        (event.clientX - bounds.left) / bounds.width - 0.5
      ) * 2;

      entry.targetY = (
        (event.clientY - bounds.top) / bounds.height - 0.5
      ) * 2;
    }, { passive: true });

    container.addEventListener("pointerleave", () => {
      entry.targetX = 0;
      entry.targetY = 0;
    });

    threeScenes.push(entry);
    return entry;
  }

  /* -------------------------------------------------------
     PROCEDURAL PARTICLES
  ------------------------------------------------------- */

  function createParticleField(scene, count = 500) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorA = new THREE.Color(0xff38c7);
    const colorB = new THREE.Color(0x43f5ff);

    for (let i = 0; i < count; i++) {
      const index = i * 3;

      positions[index] = (Math.random() - 0.5) * 13;
      positions[index + 1] = (Math.random() - 0.5) * 9;
      positions[index + 2] = (Math.random() - 0.5) * 9;

      const color = Math.random() > 0.5 ? colorA : colorB;

      colors[index] = color.r;
      colors[index + 1] = color.g;
      colors[index + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return particles;
  }

  /* -------------------------------------------------------
     HERO — 3D CHROME ARTIFACT
  ------------------------------------------------------- */

  function initHero3D() {
    const container = $("#hero3d");

    if (!container || !window.THREE) return null;

    const entry = createScene(container, {
      cameraZ: 5.8,
      fov: 39
    });

    if (!entry) return null;

    const { scene, camera, keyLight, fillLight, rimLight } = entry;

    const artifact = new THREE.Group();
    scene.add(artifact);

    const mainGeometry = new THREE.TorusKnotGeometry(
      1.03,
      0.31,
      180,
      28,
      2,
      5
    );

    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf5eaff,
      metalness: 0.94,
      roughness: 0.17,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x260b3a,
      emissiveIntensity: 0.38
    });

    const core = new THREE.Mesh(mainGeometry, chromeMaterial);
    artifact.add(core);

    const wireGeometry = new THREE.TorusKnotGeometry(
      1.12,
      0.012,
      150,
      8,
      2,
      5
    );

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xff38c7,
      transparent: true,
      opacity: 0.9,
      wireframe: false
    });

    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    artifact.add(wire);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x8e48ff,
      emissive: 0x401080,
      emissiveIntensity: 0.65,
      metalness: 0.75,
      roughness: 0.3
    });

    const rings = [];

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          1.55 + i * 0.13,
          0.009,
          8,
          150
        ),
        ringMaterial.clone()
      );

      ring.rotation.x = Math.PI * (0.25 + i * 0.22);
      ring.rotation.y = Math.PI * (0.12 + i * 0.3);

      artifact.add(ring);
      rings.push(ring);
    }

    const particles = createParticleField(scene, 520);

    const energyScale = state.energy;

    entry.update = (delta, elapsed) => {
      entry.pointerX += (entry.targetX - entry.pointerX) * 0.045;
      entry.pointerY += (entry.targetY - entry.pointerY) * 0.045;

      if (state.rotating && !reducedMotion) {
        artifact.rotation.y += delta * 0.24;
        artifact.rotation.x += delta * 0.11;
        wire.rotation.y -= delta * 0.1;

        rings.forEach((ring, index) => {
          ring.rotation.z += delta * (0.08 + index * 0.035);
        });

        particles.rotation.y += delta * 0.008;
      }

      artifact.rotation.y += entry.pointerX * 0.001;
      artifact.rotation.x += entry.pointerY * 0.001;

      artifact.position.x = entry.pointerX * 0.12;
      artifact.position.y = -entry.pointerY * 0.10;

      const pulse = reducedMotion
        ? 1
        : 1 + Math.sin(elapsed * 1.1) * 0.025 * state.energy;

      artifact.scale.setScalar(pulse * (0.90 + energyScale * 0.10));

      keyLight.intensity = 2.2 + state.energy * 1.7;
      fillLight.intensity = 1.5 + state.energy;
      rimLight.intensity = 1.5 + state.energy * 1.1;

      camera.position.x += (
        entry.pointerX * 0.18 - camera.position.x
      ) * 0.025;

      camera.position.y += (
        -entry.pointerY * 0.15 - camera.position.y
      ) * 0.025;

      camera.lookAt(0, 0, 0);
    };

    return {
      entry,
      artifact,
      core,
      wire,
      rings,
      particles
    };
  }

  /* -------------------------------------------------------
     LAB — INTERACTIVE 3D CONTROLS
  ------------------------------------------------------- */

  let labObject = null;

  function initLab3D() {
    const container = $("#lab3d");

    if (!container || !window.THREE) return null;

    const entry = createScene(container, {
      cameraZ: 5.5,
      fov: 43
    });

    if (!entry) return null;

    const { scene, camera, keyLight, fillLight, rimLight } = entry;

    const group = new THREE.Group();
    scene.add(group);

    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8e2ff,
      metalness: 0.96,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x250a36,
      emissiveIntensity: 0.4
    });

    const geometry = new THREE.TorusKnotGeometry(
      1.0,
      0.29,
      200,
      32,
      2,
      5
    );

    const mainMesh = new THREE.Mesh(geometry, mainMaterial);
    group.add(mainMesh);

    const secondary = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.36, 1),
      new THREE.MeshBasicMaterial({
        color: palettes[state.color].primary,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
    );

    group.add(secondary);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.7, 0.012, 8, 180),
      new THREE.MeshBasicMaterial({
        color: palettes[state.color].primary,
        transparent: true,
        opacity: 0.75
      })
    );

    outerRing.rotation.x = Math.PI / 2.5;
    group.add(outerRing);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.009, 8, 150),
      new THREE.MeshBasicMaterial({
        color: palettes[state.color].secondary,
        transparent: true,
        opacity: 0.85
      })
    );

    innerRing.rotation.y = Math.PI / 2.3;
    group.add(innerRing);

    const particles = createParticleField(scene, 700);

    entry.update = (delta, elapsed) => {
      entry.pointerX += (entry.targetX - entry.pointerX) * 0.055;
      entry.pointerY += (entry.targetY - entry.pointerY) * 0.055;

      if (state.rotating && !reducedMotion) {
        group.rotation.y += delta * 0.22;
        group.rotation.x += delta * 0.08;
        secondary.rotation.y -= delta * 0.15;
        secondary.rotation.x += delta * 0.05;
        outerRing.rotation.z += delta * 0.13;
        innerRing.rotation.x -= delta * 0.11;
        particles.rotation.y += delta * 0.006;
      }

      group.rotation.y += entry.pointerX * 0.002;
      group.rotation.x += entry.pointerY * 0.002;

      group.position.x = entry.pointerX * 0.13;
      group.position.y = -entry.pointerY * 0.09;

      const scale = 0.90 + state.energy * 0.18;

      group.scale.setScalar(
        reducedMotion
          ? scale
          : scale + Math.sin(elapsed * 1.1) * 0.018 * state.energy
      );

      keyLight.intensity = 1.7 + state.energy * 2.5;
      fillLight.intensity = 1.0 + state.energy * 1.7;
      rimLight.intensity = 1.0 + state.energy * 1.5;

      camera.position.x += (
        entry.pointerX * 0.3 - camera.position.x
      ) * 0.03;

      camera.position.y += (
        -entry.pointerY * 0.2 - camera.position.y
      ) * 0.03;

      camera.lookAt(0, 0, 0);

      const coordX = $("#coordX");
      const coordY = $("#coordY");

      if (coordX) {
        coordX.textContent = String(
          Math.round((entry.pointerX + 1) * 50)
        ).padStart(3, "0");
      }

      if (coordY) {
        coordY.textContent = String(
          Math.round((entry.pointerY + 1) * 50)
        ).padStart(3, "0");
      }
    };

    labObject = {
      entry,
      group,
      mainMesh,
      mainMaterial,
      secondary,
      outerRing,
      innerRing,
      particles
    };

    return labObject;
  }

  /* -------------------------------------------------------
     COLOR MODES
  ------------------------------------------------------- */

  function applyColorMode(colorName) {
    const palette = palettes[colorName];
    if (!palette) return;

    state.color = colorName;

    $$(".color-switch").forEach(button => {
      const active = button.dataset.color === colorName;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (labObject) {
      labObject.mainMaterial.emissive.setHex(
        palette.secondary
      );

      labObject.mainMaterial.emissiveIntensity =
        0.15 + state.energy * 0.45;

      labObject.secondary.material.color.setHex(
        palette.primary
      );

      labObject.outerRing.material.color.setHex(
        palette.primary
      );

      labObject.innerRing.material.color.setHex(
        palette.secondary
      );

      labObject.entry.keyLight.color.setHex(
        palette.primary
      );

      labObject.entry.fillLight.color.setHex(
        palette.secondary
      );

      labObject.entry.rimLight.color.setHex(
        palette.glow
      );
    }

    const glow = $(".lab-stage-glow");

    if (glow) {
      glow.style.background = hexColor(palette.primary);
    }

    const mode = $("#renderMode");

    if (mode) {
      mode.textContent = `MODE: ${colorName.toUpperCase()}`;
    }
  }

  function initLabControls() {
    const energyControl = $("#energyControl");
    const energyValue = $("#energyValue");
    const spinToggle = $("#spinToggle");

    $$(".color-switch").forEach(button => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.color === state.color)
      );

      button.addEventListener("click", () => {
        applyColorMode(button.dataset.color);
        toast(
          `${button.dataset.color.toUpperCase()} ENERGY MODE ACTIVATED`
        );
      });
    });

    if (energyControl) {
      energyControl.addEventListener("input", () => {
        const value = Number(energyControl.value);

        state.energy = clamp(value / 100, 0.1, 1);

        if (energyValue) {
          energyValue.textContent = `${value}%`;
        }

        if (labObject) {
          labObject.mainMaterial.emissiveIntensity =
            0.15 + state.energy * 0.45;
        }
      });
    }

    if (spinToggle) {
      spinToggle.addEventListener("click", () => {
        state.rotating = !state.rotating;

        spinToggle.innerHTML = state.rotating
          ? 'PAUSE ROTATION <span>Ⅱ</span>'
          : 'RESUME ROTATION <span>▶</span>';

        spinToggle.setAttribute(
          "aria-pressed",
          String(!state.rotating)
        );

        toast(
          state.rotating
            ? "ROTATION RESUMED"
            : "ROTATION PAUSED"
        );
      });
    }
  }

  /* -------------------------------------------------------
     SHARED THREE.JS ANIMATION LOOP
  ------------------------------------------------------- */

  function startRenderLoop() {
    let previousTime = 0;

    function animate(timestamp) {
      requestAnimationFrame(animate);

      const elapsedSeconds = timestamp / 1000;

      const delta = previousTime
        ? Math.min((timestamp - previousTime) / 1000, 0.05)
        : 0;

      previousTime = timestamp;

      // Stop rendering offscreen scenes to reduce GPU usage.
      const fpsElement = $("#fpsCounter");

      threeScenes.forEach(entry => {
        if (entry.disposed || !entry.container.isConnected) {
          return;
        }

        const rect = entry.container.getBoundingClientRect();

        const visible =
          rect.bottom > -100 &&
          rect.top < window.innerHeight + 100;

        if (!visible || document.hidden) return;

        if (entry.update) {
          entry.update(delta, elapsedSeconds);
        }

        entry.renderer.render(entry.scene, entry.camera);
      });

      // Approximate render-loop frequency, not guaranteed GPU FPS.
      state.frameCount++;

      if (elapsedSeconds - state.fpsTime >= 1) {
        if (fpsElement) {
          fpsElement.textContent =
            `RENDER LOOP / ${state.frameCount} FPS`;
        }

        state.frameCount = 0;
        state.fpsTime = elapsedSeconds;
      }
    }

    requestAnimationFrame(animate);
  }

  /* -------------------------------------------------------
     PROJECT INSPECTION DIALOG
  ------------------------------------------------------- */

  function initProjectDialogs() {
    const dialog = $("#detailDialog");
    const closeButton = $("#closeDialog");

    if (!dialog) return;

    function closeDialog() {
      if (dialog.open) dialog.close();
      document.body.classList.remove("dialog-open");
    }

    $$("[data-detail]").forEach(button => {
      button.addEventListener("click", () => {
        const project = projects[button.dataset.detail];

        if (!project) return;

        const index = $("#dialogIndex");
        const title = $("#dialogTitle");
        const description = $("#dialogDescription");

        if (index) index.textContent = project.index;
        if (title) title.textContent = project.title;
        if (description) description.textContent = project.description;

        if (typeof dialog.showModal === "function") {
          dialog.showModal();
          document.body.classList.add("dialog-open");
        } else {
          toast(project.description);
        }
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", closeDialog);
    }

    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
    });

    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDialog();
    });
  }

  /* -------------------------------------------------------
     INTERACTIVE TERMINAL
  ------------------------------------------------------- */

  function initTerminal() {
    const input = $("#terminalInput");
    const runButton = $("#terminalRun");
    const output = $("#terminalBody");

    if (!input || !runButton || !output) return;

    const commands = {
      help: {
        type: "info",
        lines: [
          "AVAILABLE COMMANDS",
          "HELP    — DISPLAY THIS MENU",
          "STATUS  — CHECK SYSTEM STATUS",
          "ABOUT   — PROJECT INFORMATION",
          "CLEAR   — CLEAR TERMINAL OUTPUT",
          "MATRIX  — TRIGGER A VISUAL GLITCH"
        ]
      },

      status: {
        type: "success",
        lines: [
          "[ OK ] ARCADE SYSTEM ONLINE",
          "[ OK ] INTERACTION MODULES READY",
          "[ OK ] 3D SCENE STATUS: CHECKING",
          "[ OK ] CREATIVE PROTOCOL ENABLED"
        ]
      },

      about: {
        type: "info",
        lines: [
          "GLITCH ARCADE 2099",
          "CREATED BY NIVEDITA THANAPATI",
          "CONCEPT: IMMERSIVE 3D WEB EXPERIENCE",
          "STACK: HTML / CSS / JAVASCRIPT / THREE.JS",
          "MISSION: MAKE THE WEB FEEL ALIVE"
        ]
      },

      matrix: {
        type: "glitch",
        lines: [
          "REALITY BUFFER CORRUPTED...",
          "PIXELS REASSEMBLED.",
          "WELCOME TO THE OTHER SIDE."
        ]
      }
    };

    function appendLine(text, type = "info") {
      const line = document.createElement("p");
      line.className = type === "success"
        ? "terminal-output"
        : "terminal-output";

      line.textContent = text;

      if (type === "glitch") {
        line.style.color = "var(--pink)";
      }

      output.appendChild(line);
    }

    function runCommand() {
      const command = input.value.trim().toLowerCase();

      if (!command) return;

      appendLine(`guest@arcade:~$ ${command}`);

      input.value = "";

      if (command === "clear") {
        output.replaceChildren();
        appendLine("TERMINAL CLEARED. SYSTEM READY.", "success");
        return;
      }

      const result = commands[command];

      if (!result) {
        appendLine(
          `COMMAND NOT FOUND: ${command}. TYPE "help" FOR OPTIONS.`,
          "glitch"
        );
        return;
      }

      if (command === "matrix") {
        document.body.classList.add("terminal-glitch");

        setTimeout(() => {
          document.body.classList.remove("terminal-glitch");
        }, 450);

        const title = $(".glitch-title");

        if (title) {
          title.classList.remove("glitching");
          void title.offsetWidth;
          title.classList.add("glitching");

          setTimeout(() => {
            title.classList.remove("glitching");
          }, 300);
        }
      }

      result.lines.forEach(line => {
        appendLine(line, result.type);
      });

      output.scrollTop = output.scrollHeight;
    }

    runButton.addEventListener("click", runCommand);

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        runCommand();
      }
    });
  }

  /* -------------------------------------------------------
     SMOOTH ANCHOR NAVIGATION
  ------------------------------------------------------- */

  function initAnchorNavigation() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", href);
        }
      });
    });
  }

  /* -------------------------------------------------------
     WEBGL FALLBACK
  ------------------------------------------------------- */

  function show3DFallback() {
    const hero = $("#hero3d");
    const lab = $("#lab3d");

    if (hero) {
      hero.innerHTML =
        '<div class="canvas-fallback" aria-label="Decorative fallback">' +
        '<div class="fallback-core"></div></div>';
    }

    if (lab) {
      lab.innerHTML =
        '<div class="lab-fallback-shape" aria-label="Decorative fallback">' +
        '</div>';
    }

    const renderMode = $("#renderMode");

    if (renderMode) {
      renderMode.textContent = "MODE: CSS FALLBACK";
    }

    const fps = $("#fpsCounter");

    if (fps) {
      fps.textContent = "WEBGL UNAVAILABLE";
    }
  }

  /* -------------------------------------------------------
     CLEANUP
  ------------------------------------------------------- */

  function cleanupThreeScenes() {
    threeScenes.forEach(entry => {
      entry.disposed = true;
      entry.resizeObserver.disconnect();

      entry.scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach(material => material.dispose());
        }
      });

      entry.renderer.dispose();
      entry.renderer.domElement.remove();
    });

    threeScenes.length = 0;
  }

  /* -------------------------------------------------------
     INITIALIZATION
  ------------------------------------------------------- */

  function init() {
    initBootSequence();
    initNavigation();
    initPointerAura();
    initScrollReveal();
    initGlitchTitle();
    initAnchorNavigation();
    initProjectDialogs();
    initTerminal();

    const hasThree = Boolean(window.THREE);

    if (hasThree) {
      initHero3D();
      initLab3D();
      initLabControls();
      applyColorMode(state.color);
      startRenderLoop();
    } else {
      show3DFallback();
      initLabControls();
      console.warn(
        "Three.js could not load. The CSS fallback remains available."
      );
    }

    window.addEventListener("pagehide", cleanupThreeScenes, {
      once: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
