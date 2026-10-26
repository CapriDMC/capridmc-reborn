/**
 * CoeruleusEngine — Bio-Kinematic Procedural Renderer (FINAL PRODUCTION RELEASE)
 * Specie: Podarcis siculus coeruleus (Lucertola Azzurra dei Faraglioni di Capri)
 * Include:
 *  - Blocco 1: Scheletro 28 vertebre, 2-Bone IK a 5 dita artigliate, Livrea Coeruleus & SLEEP_CURL
 *  - Blocco 2: Srotolamento dinamico, Camminata diagonale sincronizzata allo scroll & SOMERSAULT (Capriola)
 *  - Blocco 3: Rilevamento stop scroll, Sguardo 2.5D verso l'utente, Sacca golare, Fauci & Sibilo (IDLE_HISS) + Responsive
 */

export const LIZARD_STATES = {
  SLEEP_CURL: 'SLEEP_CURL',
  WALK_DOWN: 'WALK_DOWN',
  WALK_UP: 'WALK_UP',
  SOMERSAULT: 'SOMERSAULT',
  IDLE_HISS: 'IDLE_HISS',
};

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const angleDiff = (target, current) => {
  let d = (target - current) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};

export class CoeruleusLizard {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });

    this.baseScale = options.scale ?? 1.15;
    this.baseMarginRight = options.marginRight ?? 95;
    this.baseMarginTop = options.marginTop ?? 95;
    this.baseMarginBottom = options.marginBottom ?? 115;

    this.scale = this.baseScale;
    this.marginRight = this.baseMarginRight;
    this.marginTop = this.baseMarginTop;
    this.marginBottom = this.baseMarginBottom;

    this.state = LIZARD_STATES.SLEEP_CURL;
    this.curlMix = 1.0;
    this.targetCurlMix = 1.0;
    this.eyeOpenMix = 0.0;
    this.targetEyeOpen = 0.0;

    this.facingDir = 1;
    this.headingAngle = -Math.PI / 2;
    this.walkPhase = 0.0;
    this.walkIntensity = 0.0;
    this.scrollVelocity = 0.0;

    this.isFlipping = false;
    this.flipProgress = 0.0;
    this.flipDuration = 0.42;
    this.flipStartAngle = -Math.PI / 2;
    this.flipEndAngle = Math.PI / 2;
    this.flipSpinSign = 1;
    this.vaultHeight = 0.0;

    this.lastRawScrollY = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
    this.dirAccumulator = 0;
    this.hysteresisThreshold = 18;

    this.hasScrolledOnce = false;
    this.timeSinceLastScroll = 0.0;
    this.idleTriggerDelay = options.idleDelay ?? 0.55;
    this.hissMix = 0.0;
    this.targetHissMix = 0.0;
    this.jawOpen = 0.0;
    this.throatInflation = 0.0;
    this.hissPulsePhase = 0.0;

    this.viewerTarget = {
      x: typeof window !== 'undefined' ? window.innerWidth * 0.45 : 500,
      y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400,
    };

    this.pos = { x: 0, y: 0 };
    this.targetPos = { x: 0, y: 0 };
    this.scrollProgress = 0;

    this.time = 0;
    this.dpr = 1;

    this.numNodes = 28;
    this.spine = [];
    this.initAnatomy();
    this.dorsalSpots = this.generateDorsalPattern();

    this.handleResize = this.handleResize.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });

    this.handleResize();
    this.syncInitialScrollPosition();

    this.rafId = null;
    this.lastFrameTime = performance.now();
    this.startLoop();
  }

  initAnatomy() {
    const baseRadii = [
      5.5, 8.2, 6.0, 7.8, 9.6, 11.0, 10.8, 9.5, 7.8, 6.4,
      5.2, 4.5, 4.0, 3.6, 3.2, 2.9, 2.6, 2.3, 2.0, 1.8,
      1.5, 1.3, 1.1, 0.95, 0.8, 0.65, 0.5, 0.35
    ];

    const baseLengths = [
      9.0, 8.5, 8.0, 8.5, 9.0, 9.0, 9.0, 8.5, 8.0, 7.5,
      7.2, 7.0, 6.8, 6.6, 6.5, 6.4, 6.2, 6.0, 5.8, 5.6,
      5.4, 5.2, 5.0, 4.8, 4.5, 4.2, 4.0, 3.8
    ];

    this.spine = [];
    for (let i = 0; i < this.numNodes; i++) {
      this.spine.push({
        x: 0,
        y: 0,
        angle: 0,
        baseRadius: baseRadii[i],
        radius: baseRadii[i],
        segLen: baseLengths[i],
      });
    }

    this.legs = [
      { id: 'FL', side: -1, attachNode: 3, l1: 13, l2: 12, bendDir: -1, isHind: false, phaseOffset: 0 },
      { id: 'FR', side:  1, attachNode: 3, l1: 13, l2: 12, bendDir:  1, isHind: false, phaseOffset: Math.PI },
      { id: 'HL', side: -1, attachNode: 9, l1: 17, l2: 16, bendDir:  1, isHind: true,  phaseOffset: Math.PI },
      { id: 'HR', side:  1, attachNode: 9, l1: 17, l2: 16, bendDir: -1, isHind: true,  phaseOffset: 0 },
    ];
  }

  generateDorsalPattern() {
    const spots = [];
    let seed = 4219;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 2; i <= 14; i++) {
      const count = i <= 9 ? 3 : 2;
      for (let s = 0; s < count; s++) {
        spots.push({
          nodeIdx: i,
          lateralOffset: (rand() - 0.5) * 1.15,
          longOffset: (rand() - 0.5) * 0.6,
          rx: 1.8 + rand() * 2.2,
          ry: 1.2 + rand() * 1.6,
          rot: rand() * Math.PI,
          isCyanOcellus: s === 0 && (i === 3 || i === 4 || i === 6),
        });
      }
    }
    return spots;
  }

  handlePointerMove(e) {
    this.viewerTarget.x = e.clientX;
    this.viewerTarget.y = e.clientY;
  }

  handleResize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);

    if (width < 768) {
      this.scale = this.baseScale * 0.68;
      this.marginRight = 42;
      this.marginTop = 72;
      this.marginBottom = 85;
      this.viewerTarget.x = width * 0.35;
      this.viewerTarget.y = height * 0.48;
    } else if (width < 1024) {
      this.scale = this.baseScale * 0.86;
      this.marginRight = 68;
      this.marginTop = 85;
      this.marginBottom = 100;
    } else {
      this.scale = this.baseScale;
      this.marginRight = this.baseMarginRight;
      this.marginTop = this.baseMarginTop;
      this.marginBottom = this.baseMarginBottom;
    }

    this.updateTargetPositionFromProgress(this.scrollProgress);
    if (this.time === 0) {
      this.pos.x = this.targetPos.x;
      this.pos.y = this.targetPos.y;
    }
  }

  syncInitialScrollPosition() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const currentY = window.scrollY || 0;
    this.lastRawScrollY = currentY;
    this.scrollProgress = clamp(currentY / maxScroll, 0, 1);
    this.updateTargetPositionFromProgress(this.scrollProgress);
    this.pos.x = this.targetPos.x;
    this.pos.y = this.targetPos.y;

    if (currentY > 10) {
      this.hasScrolledOnce = true;
      this.state = LIZARD_STATES.WALK_DOWN;
      this.curlMix = 0;
      this.targetCurlMix = 0;
      this.eyeOpenMix = 1;
      this.targetEyeOpen = 1;
    }
  }

  updateTargetPositionFromProgress(progress) {
    const s = this.scale;
    const topY = this.marginTop * s;
    const bottomY = Math.max(topY + 50, window.innerHeight - this.marginBottom * s);

    const swayX = Math.sin(this.walkPhase * 0.5) * 4.5 * s * (1 - this.curlMix) * (1 - this.hissMix);
    this.targetPos.x = window.innerWidth - this.marginRight * s + swayX;
    this.targetPos.y = lerp(topY, bottomY, clamp(progress, 0, 1));
  }

  onScrollUpdate(progress, scrollY, velocity = 0) {
    const deltaY = scrollY - this.lastRawScrollY;
    this.lastRawScrollY = scrollY;
    this.scrollProgress = clamp(progress, 0, 1);
    this.scrollVelocity = velocity;

    if (scrollY <= 8 && Math.abs(deltaY) < 4) {
      this.state = LIZARD_STATES.SLEEP_CURL;
      this.targetCurlMix = 1.0;
      this.targetEyeOpen = 0.0;
      this.targetHissMix = 0.0;
      this.dirAccumulator = 0;
      this.timeSinceLastScroll = 0;
      if (!this.isFlipping) {
        this.facingDir = 1;
        this.headingAngle = -Math.PI / 2;
      }
      this.updateTargetPositionFromProgress(this.scrollProgress);
      return;
    }

    if (scrollY > 8) {
      this.hasScrolledOnce = true;
      this.targetCurlMix = 0.0;
      this.targetEyeOpen = 1.0;
      if (this.state === LIZARD_STATES.SLEEP_CURL) {
        this.state = LIZARD_STATES.WALK_DOWN;
        this.facingDir = 1;
        this.headingAngle = -Math.PI / 2;
      }
    }

    if (Math.abs(deltaY) > 0.25) {
      this.timeSinceLastScroll = 0.0;
      this.targetHissMix = 0.0;

      if (this.state === LIZARD_STATES.IDLE_HISS && !this.isFlipping) {
        this.state = this.facingDir === 1 ? LIZARD_STATES.WALK_DOWN : LIZARD_STATES.WALK_UP;
      }

      const instantDir = deltaY > 0 ? 1 : -1;

      if (instantDir !== this.facingDir) {
        this.dirAccumulator += deltaY;
        if (Math.abs(this.dirAccumulator) >= this.hysteresisThreshold && this.curlMix < 0.45) {
          this.triggerSomersault(instantDir);
          this.dirAccumulator = 0;
        }
      } else {
        this.dirAccumulator = 0;
      }

      const stepAdvance = Math.min(Math.abs(deltaY), 48) * 0.095;
      this.walkPhase += stepAdvance;
      this.walkIntensity = clamp(Math.abs(deltaY) * 0.14 + Math.abs(velocity) * 0.0008, 0.25, 1.0);
    }

    this.updateTargetPositionFromProgress(this.scrollProgress);
  }

  triggerSomersault(newDir) {
    this.facingDir = newDir;
    this.isFlipping = true;
    this.flipProgress = 0.0;
    this.targetHissMix = 0.0;
    this.hissMix = 0.0;
    this.state = LIZARD_STATES.SOMERSAULT;

    this.flipStartAngle = this.headingAngle;
    this.flipSpinSign = newDir === -1 ? 1 : -1;
    this.flipEndAngle = newDir === 1 ? -Math.PI / 2 : Math.PI / 2;
  }

  updateKinematics(dt) {
    this.time += dt;
    const s = this.scale;

    if (
      this.hasScrolledOnce &&
      this.state !== LIZARD_STATES.SLEEP_CURL &&
      !this.isFlipping &&
      this.curlMix < 0.2
    ) {
      this.timeSinceLastScroll += dt;
      if (this.timeSinceLastScroll >= this.idleTriggerDelay) {
        if (this.state !== LIZARD_STATES.IDLE_HISS) {
          this.state = LIZARD_STATES.IDLE_HISS;
          this.hissPulsePhase = 0.0;
        }
        this.targetHissMix = 1.0;
      }
    } else {
      this.targetHissMix = 0.0;
    }

    this.pos.x = lerp(this.pos.x, this.targetPos.x, clamp(dt * 14, 0, 1));
    this.pos.y = lerp(this.pos.y, this.targetPos.y, clamp(dt * 14, 0, 1));
    this.curlMix = lerp(this.curlMix, this.targetCurlMix, clamp(dt * 7.5, 0, 1));
    this.eyeOpenMix = lerp(this.eyeOpenMix, this.targetEyeOpen, clamp(dt * 9.0, 0, 1));

    const hissSpeed = this.targetHissMix > this.hissMix ? 6.5 : 14.0;
    this.hissMix = lerp(this.hissMix, this.targetHissMix, clamp(dt * hissSpeed, 0, 1));

    if (this.hissMix > 0.01) {
      this.hissPulsePhase += dt * 7.5;
      this.throatInflation = this.hissMix * (0.75 + 0.25 * Math.sin(this.hissPulsePhase * 1.1));
      const hissBurst = clamp(Math.sin(this.hissPulsePhase * 0.65) + 0.45, 0.25, 1.0);
      this.jawOpen = this.hissMix * hissBurst;
    } else {
      this.throatInflation = 0.0;
      this.jawOpen = 0.0;
    }

    this.walkIntensity = lerp(this.walkIntensity, 0.0, clamp(dt * 7.5, 0, 1));
    if (this.walkIntensity > 0.02 && !this.isFlipping && this.hissMix < 0.2) {
      this.walkPhase += this.walkIntensity * dt * 5.5;
    }

    let somersaultSpineCurl = 0;
    if (this.isFlipping) {
      this.flipProgress += dt / this.flipDuration;
      if (this.flipProgress >= 1.0) {
        this.flipProgress = 1.0;
        this.isFlipping = false;
        this.vaultHeight = 0.0;
        this.headingAngle = this.flipEndAngle;
        this.state = this.facingDir === 1 ? LIZARD_STATES.WALK_DOWN : LIZARD_STATES.WALK_UP;
      } else {
        const eased = easeInOutCubic(this.flipProgress);
        this.headingAngle = lerp(this.flipStartAngle, this.flipEndAngle, eased);
        this.vaultHeight = Math.sin(this.flipProgress * Math.PI);
        somersaultSpineCurl = this.vaultHeight * 0.22 * this.flipSpinSign;
      }
    } else {
      this.vaultHeight = lerp(this.vaultHeight, 0.0, clamp(dt * 12, 0, 1));
      const desiredHeading = this.facingDir === 1 ? -Math.PI / 2 : Math.PI / 2;
      this.headingAngle = lerp(this.headingAngle, desiredHeading, clamp(dt * 10, 0, 1));
    }

    const breathFreq = lerp(6.2, 2.1, this.curlMix) + this.hissMix * 3.5;
    const breathWave = Math.sin(this.time * breathFreq);

    for (let i = 0; i < this.numNodes; i++) {
      let r = this.spine[i].baseRadius * s;
      if (i >= 4 && i <= 7) {
        const chestWeight = Math.sin(((i - 3) / 5) * Math.PI);
        const threatBoost = 1.0 + this.hissMix * 0.14;
        r *= (1.0 + breathWave * 0.055 * chestWeight) * threatBoost;
      }
      if (i >= 1 && i <= 3 && this.throatInflation > 0.01) {
        const gularWeight = i === 2 ? 1.38 : 1.18;
        r *= 1.0 + this.throatInflation * (gularWeight - 1.0);
      }
      this.spine[i].radius = r;
    }

    const toViewerAngle = Math.atan2(
      this.viewerTarget.y - this.pos.y,
      this.viewerTarget.x - this.pos.x
    );
    const desiredSpineHeadAngle = toViewerAngle - Math.PI;
    const gazeTurnDelta = clamp(
      angleDiff(desiredSpineHeadAngle, this.headingAngle),
      -1.25,
      1.25
    );

    const sleepStartAngle = -Math.PI * 0.65 + Math.sin(this.time * 1.05) * 0.025;
    let currentAngle = lerp(this.headingAngle, sleepStartAngle, this.curlMix);
    currentAngle += gazeTurnDelta * this.hissMix * 0.88;

    const activeWalkMix = (1.0 - this.curlMix) * (1.0 - this.vaultHeight * 0.7) * (1.0 - this.hissMix * 0.85);
    const headSway = Math.sin(this.walkPhase) * 0.09 * activeWalkMix;
    currentAngle += headSway;

    const localNodes = [];
    let cx = 0;
    let cy = 0;
    const pitchCompression = 1.0 - this.vaultHeight * 0.22;

    for (let i = 0; i < this.numNodes; i++) {
      localNodes.push({ x: cx, y: cy, angle: currentAngle });

      let sleepDelta = 0;
      if (i === 0) sleepDelta = 0.16;
      else if (i <= 9) sleepDelta = 0.25 + Math.sin(this.time * 2.1) * 0.004;
      else if (i <= 20) sleepDelta = 0.215;
      else {
        const tailTipWave = Math.sin(this.time * 3.4 - i * 0.6) * 0.035;
        sleepDelta = 0.17 + tailTipWave;
      }

      let walkDelta = 0;
      if (i >= 1 && i <= 3) {
        walkDelta = -Math.cos(this.walkPhase - i * 0.35) * 0.055;
      } else if (i >= 4 && i <= 9) {
        walkDelta = Math.sin(this.walkPhase - i * 0.48) * 0.085;
      } else if (i >= 10) {
        const tailProgress = (i - 10) / 17;
        const dynamicWave =
          Math.sin(this.walkPhase - i * 0.36) *
          (0.075 + tailProgress * 0.09) *
          (0.35 + 0.65 * this.walkIntensity);
        const idleAliveWave = Math.sin(this.time * 2.6 - i * 0.3) * 0.018 * (1 - this.walkIntensity);
        walkDelta = dynamicWave + idleAliveWave;
      }

      let hissDelta = 0;
      if (i <= 3) {
        hissDelta = -gazeTurnDelta * 0.22;
      } else if (i >= 4 && i <= 9) {
        hissDelta = Math.sin((i - 4) * 0.55) * 0.045 * this.facingDir;
      } else if (i >= 14) {
        const tailTension = (i - 14) / 13;
        hissDelta = Math.sin(this.time * 11.5 - i * 0.55) * 0.085 * tailTension;
      }

      let flipDelta = 0;
      if (this.isFlipping) {
        const tailWhip = i >= 10 ? 1.35 : 0.85;
        flipDelta = somersaultSpineCurl * tailWhip;
      }

      const totalDelta =
        sleepDelta * this.curlMix +
        walkDelta * activeWalkMix +
        hissDelta * this.hissMix +
        flipDelta;

      currentAngle += totalDelta;

      const neckForeshortening = i <= 2 ? 1.0 - this.hissMix * 0.18 : 1.0;
      const step = this.spine[i].segLen * s * (i <= 9 ? pitchCompression : 1.0) * neckForeshortening;
      cx += Math.cos(currentAngle) * step;
      cy += Math.sin(currentAngle) * step;
    }

    let centerX = 0;
    let centerY = 0;
    for (let i = 3; i <= 9; i++) {
      centerX += localNodes[i].x;
      centerY += localNodes[i].y;
    }
    centerX /= 7;
    centerY /= 7;

    for (let i = 0; i < this.numNodes; i++) {
      this.spine[i].x = this.pos.x + (localNodes[i].x - centerX);
      this.spine[i].y = this.pos.y + (localNodes[i].y - centerY);
      this.spine[i].angle = localNodes[i].angle;
    }

    this.solvedLegs = this.legs.map((leg) => this.solveLegIK(leg));
  }

  solveLegIK(leg) {
    const s = this.scale;
    const node = this.spine[leg.attachNode];
    const normalAngle = node.angle + (Math.PI / 2) * leg.side;
    const forwardAngle = node.angle + Math.PI;

    const hipX = node.x + Math.cos(normalAngle) * (node.radius * 0.78);
    const hipY = node.y + Math.sin(normalAngle) * (node.radius * 0.78);

    const l1 = leg.l1 * s;
    const l2 = leg.l2 * s;

    const sleepSpread = (leg.isHind ? 15.5 : 13.0) * s;
    const sleepForward = (leg.isHind ? 6.5 : -5.0) * s;

    const phase = this.walkPhase + leg.phaseOffset;
    const activeStride = 1.0 - this.hissMix * 0.92;
    const strideWave = Math.sin(phase) * activeStride;
    const liftWave = Math.max(0, Math.cos(phase)) * activeStride;

    const strideLength = (leg.isHind ? 12.5 : 10.5) * s * (0.45 + 0.55 * this.walkIntensity);
    const hissStanceSpread = (!leg.isHind ? 3.2 : 1.5) * s * this.hissMix;
    const baseWalkSpread = (leg.isHind ? 19.5 : 16.5) * s + hissStanceSpread;
    const baseWalkForward = (leg.isHind ? -3.0 : 5.5) * s;

    const flipTuck = 1.0 - this.vaultHeight * 0.32;
    const walkSpread = (baseWalkSpread + liftWave * 3.8 * s) * flipTuck;
    const walkForward = (baseWalkForward + strideWave * strideLength) * flipTuck;

    const spread = lerp(walkSpread, sleepSpread, this.curlMix);
    const forward = lerp(walkForward, sleepForward, this.curlMix);

    const footX =
      hipX +
      Math.cos(normalAngle) * spread +
      Math.cos(forwardAngle) * forward;
    const footY =
      hipY +
      Math.sin(normalAngle) * spread +
      Math.sin(forwardAngle) * forward;

    const dx = footX - hipX;
    const dy = footY - hipY;
    const maxReach = (l1 + l2) * 0.96;
    const dist = Math.min(Math.hypot(dx, dy), maxReach);

    const baseAngle = Math.atan2(dy, dx);
    const cosAlpha = clamp(
      (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * Math.max(dist, 0.001)),
      -1,
      1
    );
    const alpha = Math.acos(cosAlpha);

    const kneeAngle = baseAngle + leg.bendDir * alpha;
    const kneeX = hipX + Math.cos(kneeAngle) * l1;
    const kneeY = hipY + Math.sin(kneeAngle) * l1;

    const rawLimbAngle = Math.atan2(footY - kneeY, footX - kneeX);
    const anatomicalToeDir = forwardAngle + leg.side * (leg.isHind ? 0.42 : 0.25);
    const footAngle = lerp(anatomicalToeDir, rawLimbAngle, this.curlMix);

    return {
      ...leg,
      hipX,
      hipY,
      kneeX,
      kneeY,
      footX,
      footY,
      footAngle,
      lift: liftWave * (1 - this.curlMix),
    };
  }

  computeBodyContours() {
    const leftPts = [];
    const rightPts = [];

    for (let i = 0; i < this.numNodes; i++) {
      const n = this.spine[i];
      const normL = n.angle - Math.PI / 2;
      const normR = n.angle + Math.PI / 2;

      leftPts.push({
        x: n.x + Math.cos(normL) * n.radius,
        y: n.y + Math.sin(normL) * n.radius,
      });
      rightPts.push({
        x: n.x + Math.cos(normR) * n.radius,
        y: n.y + Math.sin(normR) * n.radius,
      });
    }

    const head = this.spine[0];
    const snoutLength = head.radius * 1.45;
    const snoutTip = {
      x: head.x - Math.cos(head.angle) * snoutLength,
      y: head.y - Math.sin(head.angle) * snoutLength,
    };

    const snoutLeft = {
      x: snoutTip.x + Math.cos(head.angle - Math.PI * 0.36) * (head.radius * 0.55),
      y: snoutTip.y + Math.sin(head.angle - Math.PI * 0.36) * (head.radius * 0.55),
    };
    const snoutRight = {
      x: snoutTip.x + Math.cos(head.angle + Math.PI * 0.36) * (head.radius * 0.55),
      y: snoutTip.y + Math.sin(head.angle + Math.PI * 0.36) * (head.radius * 0.55),
    };

    return { snoutTip, snoutLeft, snoutRight, leftPts, rightPts };
  }

  traceBodyPath(ctx, contours) {
    const { snoutTip, snoutLeft, snoutRight, leftPts, rightPts } = contours;
    ctx.beginPath();
    ctx.moveTo(snoutTip.x, snoutTip.y);
    ctx.quadraticCurveTo(snoutLeft.x, snoutLeft.y, leftPts[0].x, leftPts[0].y);

    for (let i = 0; i < this.numNodes - 1; i++) {
      const xc = (leftPts[i].x + leftPts[i + 1].x) * 0.5;
      const yc = (leftPts[i].y + leftPts[i + 1].y) * 0.5;
      ctx.quadraticCurveTo(leftPts[i].x, leftPts[i].y, xc, yc);
    }
    const lastIdx = this.numNodes - 1;
    const tailTip = this.spine[lastIdx];
    ctx.lineTo(tailTip.x, tailTip.y);

    for (let i = lastIdx; i > 0; i--) {
      const xc = (rightPts[i].x + rightPts[i - 1].x) * 0.5;
      const yc = (rightPts[i].y + rightPts[i - 1].y) * 0.5;
      ctx.quadraticCurveTo(rightPts[i].x, rightPts[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(snoutRight.x, snoutRight.y, snoutTip.x, snoutTip.y);
    ctx.closePath();
  }

  drawLeg(ctx, leg) {
    const s = this.scale * (1 + (leg.lift || 0) * 0.06);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const toeAngles = [-0.65, -0.32, 0.0, 0.32, 0.72];
    const toeLengths = leg.isHind
      ? [5.5, 8.0, 10.5, 13.5, 7.5]
      : [5.0, 6.8, 8.2, 7.8, 5.5];

    for (let t = 0; t < 5; t++) {
      const a = leg.footAngle + toeAngles[t] * leg.side;
      const len = toeLengths[t] * s;
      const tx = leg.footX + Math.cos(a) * len;
      const ty = leg.footY + Math.sin(a) * len;

      ctx.beginPath();
      ctx.moveTo(leg.footX, leg.footY);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = '#0068C9';
      ctx.lineWidth = 1.65 * s;
      ctx.stroke();

      const clawX = tx + Math.cos(a + 0.15 * leg.side) * (1.8 * s);
      const clawY = ty + Math.sin(a + 0.15 * leg.side) * (1.8 * s);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(clawX, clawY);
      ctx.strokeStyle = '#9AD5FF';
      ctx.lineWidth = 0.9 * s;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(leg.hipX, leg.hipY);
    ctx.lineTo(leg.kneeX, leg.kneeY);
    ctx.strokeStyle = '#072A60';
    ctx.lineWidth = (leg.isHind ? 6.2 : 5.0) * s;
    ctx.stroke();

    ctx.strokeStyle = '#0077E6';
    ctx.lineWidth = (leg.isHind ? 4.4 : 3.5) * s;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leg.kneeX, leg.kneeY);
    ctx.lineTo(leg.footX, leg.footY);
    ctx.strokeStyle = '#072A60';
    ctx.lineWidth = (leg.isHind ? 4.8 : 4.0) * s;
    ctx.stroke();

    ctx.strokeStyle = '#0096FF';
    ctx.lineWidth = (leg.isHind ? 3.2 : 2.6) * s;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(leg.kneeX, leg.kneeY, 1.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = '#4CE0FF';
    ctx.fill();

    ctx.restore();
  }

  drawHeadDetails(ctx) {
    const s = this.scale;
    const head = this.spine[0];
    const angle = head.angle;

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(angle);

    const headElevationScale = 1.0 + this.hissMix * 0.24;
    ctx.scale(headElevationScale, headElevationScale);

    if (this.hissMix > 0.05) {
      ctx.shadowColor = `rgba(3, 12, 30, ${0.38 * this.hissMix})`;
      ctx.shadowBlur = 12 * s;
      ctx.shadowOffsetX = -4 * s;
      ctx.shadowOffsetY = 8 * s;
    }

    if (this.throatInflation > 0.02) {
      const gularRadiusX = head.radius * (1.1 + this.throatInflation * 0.55);
      const gularRadiusY = head.radius * (0.95 + this.throatInflation * 0.52);

      const gularGrad = ctx.createRadialGradient(
        head.radius * 0.35,
        0,
        1 * s,
        head.radius * 0.35,
        0,
        gularRadiusY
      );
      gularGrad.addColorStop(0.0, 'rgba(0, 240, 255, 0.85)');
      gularGrad.addColorStop(0.6, 'rgba(0, 110, 235, 0.72)');
      gularGrad.addColorStop(1.0, 'rgba(5, 32, 82, 0.0)');

      ctx.fillStyle = gularGrad;
      ctx.beginPath();
      ctx.ellipse(head.radius * 0.42, 0, gularRadiusX, gularRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.jawOpen > 0.03) {
      const openAmt = this.jawOpen;
      const mouthX = -head.radius * 1.12;
      const mouthLen = head.radius * (0.95 + openAmt * 0.55);
      const mouthWidth = head.radius * (0.62 + openAmt * 0.42);

      const tongueFlick = 0.75 + 0.25 * Math.sin(this.time * 28.0);
      const tongueLen = head.radius * (1.25 + openAmt * 1.15) * tongueFlick;
      const tongueTipX = mouthX - tongueLen;
      const tongueSwayY = Math.sin(this.time * 34.0) * (2.2 * s);
      const forkLen = 4.2 * s;
      const forkSpread = 2.6 * s;

      ctx.save();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#FF2A6D';
      ctx.lineWidth = 1.55 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mouthX + 2 * s, 0);
      ctx.quadraticCurveTo(mouthX - tongueLen * 0.5, tongueSwayY * 0.5, tongueTipX, tongueSwayY);
      ctx.moveTo(tongueTipX, tongueSwayY);
      ctx.lineTo(tongueTipX - forkLen, tongueSwayY - forkSpread);
      ctx.moveTo(tongueTipX, tongueSwayY);
      ctx.lineTo(tongueTipX - forkLen, tongueSwayY + forkSpread);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#041B46';
      ctx.beginPath();
      ctx.ellipse(mouthX, 0, mouthLen * 1.08, mouthWidth * 1.12, 0, 0, Math.PI * 2);
      ctx.fill();

      const mouthGrad = ctx.createRadialGradient(mouthX, 0, 0.5 * s, mouthX, 0, mouthLen);
      mouthGrad.addColorStop(0.0, '#A81C4B');
      mouthGrad.addColorStop(0.65, '#590D2B');
      mouthGrad.addColorStop(1.0, '#1D061A');

      ctx.fillStyle = mouthGrad;
      ctx.beginPath();
      ctx.ellipse(mouthX, 0, mouthLen * 0.92, mouthWidth * 0.88 * openAmt, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(230, 248, 255, 0.72)';
      ctx.lineWidth = 0.85 * s;
      ctx.setLineDash([1.2 * s, 1.4 * s]);
      ctx.beginPath();
      ctx.ellipse(mouthX, 0, mouthLen * 0.88, mouthWidth * 0.82 * openAmt, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.save();
      ctx.shadowColor = 'transparent';
      for (let w = 0; w < 3; w++) {
        const wavePhase = ((this.time * 2.2 + w * 0.33) % 1.0);
        const waveRadius = (10 + wavePhase * 28) * s;
        const waveAlpha = (1.0 - wavePhase) * openAmt * 0.65;

        ctx.strokeStyle = `rgba(56, 228, 255, ${waveAlpha})`;
        ctx.lineWidth = (1.8 - wavePhase * 1.1) * s;
        ctx.beginPath();
        ctx.arc(mouthX - 4 * s, 0, waveRadius, Math.PI - 0.58, Math.PI + 0.58);
        ctx.stroke();
      }
      ctx.restore();
    }

    const upperJawShift = this.jawOpen * head.radius * 0.18;
    ctx.fillStyle = '#0088F0';
    ctx.beginPath();
    ctx.ellipse(
      -head.radius * 0.25 + upperJawShift,
      0,
      head.radius * 1.05,
      head.radius * 0.72,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = 'rgba(72, 235, 255, 0.32)';
    ctx.beginPath();
    ctx.ellipse(
      -head.radius * 0.2 + upperJawShift,
      0,
      head.radius * 0.85,
      head.radius * 0.48,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    const nostrilX = -head.radius * 1.02 + upperJawShift;
    const nostrilSpread = head.radius * 0.34;
    ctx.fillStyle = '#04122B';
    ctx.beginPath();
    ctx.arc(nostrilX, -nostrilSpread, 0.9 * s, 0, Math.PI * 2);
    ctx.arc(nostrilX,  nostrilSpread, 0.9 * s, 0, Math.PI * 2);
    ctx.fill();

    const eyeX = -head.radius * 0.12 + upperJawShift * 0.5;
    const eyeSpread = head.radius * 0.68;
    const eyeRadiusX = (2.6 + this.hissMix * 0.45) * s;
    const eyeRadiusY = (1.75 + this.hissMix * 0.45) * s;

    [-1, 1].forEach((side) => {
      const ey = side * eyeSpread;

      ctx.fillStyle = '#062356';
      ctx.beginPath();
      ctx.ellipse(eyeX, ey, eyeRadiusX, eyeRadiusY, side * 0.2, 0, Math.PI * 2);
      ctx.fill();

      if (this.eyeOpenMix > 0.08) {
        ctx.fillStyle = this.hissMix > 0.3 ? '#FF9F1C' : '#E08A2E';
        ctx.beginPath();
        ctx.ellipse(
          eyeX,
          ey,
          eyeRadiusX * 0.84,
          eyeRadiusY * 0.9 * this.eyeOpenMix,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        const pupilRx = lerp(eyeRadiusY * 0.55, eyeRadiusY * 0.32, this.hissMix) * this.eyeOpenMix;
        const pupilRy = lerp(eyeRadiusY * 0.55, eyeRadiusY * 0.82, this.hissMix) * this.eyeOpenMix;
        const gazeForwardOffset = -0.45 * s * (1 + this.hissMix * 0.6);

        ctx.fillStyle = '#02060D';
        ctx.beginPath();
        ctx.ellipse(eyeX + gazeForwardOffset, ey, pupilRx, pupilRy, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.beginPath();
        ctx.arc(
          eyeX + gazeForwardOffset - 0.35 * s,
          ey - 0.35 * s,
          0.6 * s * this.eyeOpenMix,
          0,
          Math.PI * 2
        );
        ctx.fill();

        if (this.hissMix > 0.1) {
          ctx.strokeStyle = `rgba(4, 18, 44, ${0.85 * this.hissMix})`;
          ctx.lineWidth = 1.25 * s;
          ctx.beginPath();
          ctx.moveTo(eyeX - eyeRadiusX, ey - side * eyeRadiusY * 0.35);
          ctx.lineTo(eyeX + eyeRadiusX * 0.9, ey - side * eyeRadiusY * 0.85);
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = '#031026';
        ctx.lineWidth = 1.15 * s;
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeRadiusX * 0.85, ey);
        ctx.quadraticCurveTo(eyeX, ey + side * 0.6 * s, eyeX + eyeRadiusX * 0.85, ey);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(102, 238, 255, 0.55)';
        ctx.lineWidth = 0.75 * s;
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeRadiusX * 0.7, ey - side * 1.1 * s);
        ctx.quadraticCurveTo(eyeX, ey - side * 1.5 * s, eyeX + eyeRadiusX * 0.7, ey - side * 1.1 * s);
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.scale(this.dpr, this.dpr);

    const s = this.scale;

    if (this.vaultHeight > 0.001) {
      const vaultScale = 1.0 + this.vaultHeight * 0.18;
      ctx.translate(this.pos.x, this.pos.y);
      ctx.scale(vaultScale, vaultScale);
      ctx.translate(-this.pos.x, -this.pos.y);
    }

    const contours = this.computeBodyContours();

    ctx.save();
    const elevation = Math.max(this.vaultHeight, this.hissMix * 0.35);
    const shadowAlpha = lerp(0.32, 0.19, elevation);
    ctx.shadowColor = `rgba(4, 15, 35, ${shadowAlpha})`;
    ctx.shadowBlur = (14 + elevation * 16) * s;
    ctx.shadowOffsetX = (-3 - elevation * 5) * s;
    ctx.shadowOffsetY = (7 + elevation * 14) * s;

    for (const leg of this.solvedLegs) {
      this.drawLeg(ctx, leg);
    }

    this.traceBodyPath(ctx, contours);
    ctx.fillStyle = '#06204E';
    ctx.fill();
    ctx.restore();

    for (const leg of this.solvedLegs) {
      this.drawLeg(ctx, leg);
    }

    ctx.save();
    this.traceBodyPath(ctx, contours);
    ctx.clip();

    const head = this.spine[0];
    const pelvis = this.spine[9];
    const bodyGrad = ctx.createRadialGradient(
      head.x,
      head.y,
      4 * s,
      pelvis.x,
      pelvis.y,
      115 * s
    );

    const intensityBoost = Math.max(this.vaultHeight * 0.35, this.throatInflation * 0.45);
    bodyGrad.addColorStop(0.0, intensityBoost > 0.15 ? '#38E8FF' : '#00C8FF');
    bodyGrad.addColorStop(0.32, '#0077E6');
    bodyGrad.addColorStop(0.68, '#083B82');
    bodyGrad.addColorStop(1.0, '#051C42');

    ctx.fillStyle = bodyGrad;
    ctx.fillRect(
      this.pos.x - 280 * s,
      this.pos.y - 280 * s,
      560 * s,
      560 * s
    );

    ctx.strokeStyle = 'rgba(3, 14, 34, 0.35)';
    ctx.lineWidth = 1.0 * s;
    for (let i = 10; i < this.numNodes - 1; i++) {
      const n = this.spine[i];
      const norm = n.angle + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(n.x - Math.cos(norm) * n.radius, n.y - Math.sin(norm) * n.radius);
      ctx.lineTo(n.x + Math.cos(norm) * n.radius, n.y + Math.sin(norm) * n.radius);
      ctx.stroke();
    }

    for (const spot of this.dorsalSpots) {
      const n = this.spine[spot.nodeIdx];
      const norm = n.angle + Math.PI / 2;
      const sx =
        n.x +
        Math.cos(norm) * (n.radius * spot.lateralOffset) +
        Math.cos(n.angle) * (n.segLen * spot.longOffset * s);
      const sy =
        n.y +
        Math.sin(norm) * (n.radius * spot.lateralOffset) +
        Math.sin(n.angle) * (n.segLen * spot.longOffset * s);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(n.angle + spot.rot);

      if (spot.isCyanOcellus) {
        ctx.fillStyle = 'rgba(0, 242, 255, 0.82)';
        ctx.beginPath();
        ctx.ellipse(0, 0, spot.rx * 0.85 * s, spot.ry * 0.85 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(5, 9, 18, 0.82)';
        ctx.beginPath();
        ctx.ellipse(0, 0, spot.rx * s, spot.ry * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.beginPath();
    for (let i = 0; i < this.numNodes - 2; i++) {
      const n = this.spine[i];
      const lx = n.x + Math.cos(n.angle - Math.PI / 2) * (n.radius * 0.22);
      const ly = n.y + Math.sin(n.angle - Math.PI / 2) * (n.radius * 0.22);
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.strokeStyle = 'rgba(145, 242, 255, 0.42)';
    ctx.lineWidth = 2.4 * s;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();

    this.traceBodyPath(ctx, contours);
    ctx.strokeStyle = 'rgba(4, 22, 54, 0.55)';
    ctx.lineWidth = 0.9 * s;
    ctx.stroke();

    this.drawHeadDetails(ctx);

    ctx.restore();
  }

  startLoop() {
    const tick = (now) => {
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.05);
      this.lastFrameTime = now;

      this.updateKinematics(dt);
      this.render();

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('pointermove', this.handlePointerMove);
  }
}
