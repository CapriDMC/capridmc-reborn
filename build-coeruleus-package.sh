#!/usr/bin/env bash
set -e

PACKAGE_DIR="coeruleus-package"
ZIP_NAME="coeruleus-animation-package.zip"

echo "🦎 Creazione struttura cartelle in ./${PACKAGE_DIR}..."
mkdir -p "${PACKAGE_DIR}/src/scripts"
mkdir -p "${PACKAGE_DIR}/src/components"

cp src/scripts/coeruleus-engine.js "${PACKAGE_DIR}/src/scripts/coeruleus-engine.js"
cp src/components/BlueLizard.astro "${PACKAGE_DIR}/src/components/BlueLizard.astro"

cat << 'EOF' > "${PACKAGE_DIR}/preview-standalone.html"
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview Finale — Podarcis siculus coeruleus</title>
  <style>
    body {
      margin: 0;
      min-height: 480vh;
      background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
      font-family: system-ui, -apple-system, sans-serif;
      padding: 3rem;
      color: #0f172a;
    }
    .hud {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: rgba(15, 23, 42, 0.9);
      color: #f8fafc;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 14px;
      backdrop-filter: blur(8px);
      z-index: 10000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.18);
    }
    .hud strong { color: #38bdf8; }
    .marker {
      margin-top: 75vh;
      padding: 1.5rem;
      border-left: 4px solid #0284c7;
      background: rgba(255, 255, 255, 0.72);
      max-width: 540px;
      border-radius: 0 12px 12px 0;
    }
    #coeruleus-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
</head>
<body>
  <h1>Release Finale: Podarcis siculus coeruleus</h1>
  <p>Scorri la pagina e poi <strong>fermati</strong>: dopo 0.55 secondi la lucertola girerà la testa verso il tuo cursore, gonfierà la gola e sibilerà vistosamente.</p>

  <div class="marker"><strong>1. Srotolamento & Marcia</strong> — Scendi con la rotella o il trackpad e poi fermati qui per osservare <code>IDLE_HISS</code>.</div>
  <div class="marker"><strong>2. Inversione & Capriola</strong> — Risali rapidamente verso l'alto per innescare <code>SOMERSAULT</code>.</div>
  <div class="marker"><strong>3. Test Responsive</strong> — Riduci la larghezza della finestra sotto i 768px per vedere la calibrazione automatica su mobile.</div>

  <div class="hud">
    Stato: <strong id="hud-state">SLEEP_CURL</strong> | Direzione: <strong id="hud-dir">GIÙ ↓</strong>
  </div>

  <canvas id="coeruleus-canvas"></canvas>

  <script type="module">
    import { CoeruleusLizard } from './src/scripts/coeruleus-engine.js';

    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById('coeruleus-canvas');
    const lizard = new CoeruleusLizard(canvas, {
      scale: 1.2,
      marginRight: 100,
      marginTop: 95,
      marginBottom: 115,
      idleDelay: 0.55,
    });

    const hudState = document.getElementById('hud-state');
    const hudDir = document.getElementById('hud-dir');

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        lizard.onScrollUpdate(self.progress, window.scrollY, self.getVelocity());
      },
    });

    function syncHud() {
      hudState.textContent = lizard.state;
      hudDir.textContent = lizard.facingDir === 1 ? 'GIÙ ↓' : 'SU ↑';
      requestAnimationFrame(syncHud);
    }
    syncHud();
  </script>
</body>
</html>
EOF

cat << 'EOF' > "${PACKAGE_DIR}/ANTIGRAVITY_HANDOFF.md"
# ANTIGRAVITY AGENT HANDOFF: Podarcis siculus coeruleus

1. Copia `src/scripts/coeruleus-engine.js` in `src/scripts/coeruleus-engine.js`.
2. Copia `src/components/BlueLizard.astro` in `src/components/BlueLizard.astro`.
3. Assicurati che `gsap` sia installato (`npm i gsap`).
4. Includi `<BlueLizard />` nel layout principale o in `src/pages/index.astro`.
EOF

if command -v zip >/dev/null 2>&1; then
  rm -f "${ZIP_NAME}"
  zip -r "${ZIP_NAME}" "${PACKAGE_DIR}"
  echo "✅ Archivio creato con successo: ./${ZIP_NAME}"
else
  echo "⚠️ Comando zip non trovato, ma la cartella ./${PACKAGE_DIR} è pronta!"
fi
