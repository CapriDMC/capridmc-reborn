/**
 * CoeruleusEngine — Bio-Kinematic Procedural Renderer (HD LUXURY ULTRA-DEFINITION RELEASE)
 * Specie: Podarcis siculus coeruleus (Lucertola Azzurra dei Faraglioni di Capri)
 * 
 * Features:
 *  - 28-node dynamic spine chain with volumetric 3D lighting, thoracic respiration and luxury scale textures
 *  - Anatomically authentic 2-Bone IK with biological sprawling joint bend angles (elbows caudal, knees cranial)
 *  - Organic muscular limb contours, anatomical foot pads and naturally arched 5-digit paws with fine claws
 *  - 5 Behavioral states: SLEEP_CURL, WALK_DOWN, WALK_UP, SOMERSAULT (2.5D vault), IDLE_HISS (camera gaze & tongue)
 *  - High-DPI Retina supersampling (dpr >= 2.5), luxury cobalt-sapphire-gold livrea, and silky 60/120fps motion
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

    // 50% larger default scale with adjusted margin for optimal desktop placement
    this.baseScale = options.scale ?? 1.75;
    this.baseMarginRight = options.marginRight ?? 135;
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
      5.8, 8.4, 6.2, 8.0, 9.8, 11.2, 11.0, 9.8, 8.0, 6.6,
      5.4, 4.6, 4.1, 3.7, 3.3, 3.0, 2.7, 2.4, 2.1, 1.9,
      1.6, 1.35, 1.15, 0.98, 0.82, 0.68, 0.52, 0.38
    ];

    const baseLengths = [
      9.2, 8.6, 8.2, 8.6, 9.2, 9.2, 9.2, 8.6, 8.2, 7.6,
      7.3, 7.1, 6.9, 6.7, 6.6, 6.4, 6.2, 6.0, 5.8, 5.6,
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

    // Anatomically correct biological bend directions:
    // - Front limbs (FL, FR): Elbows bend CAUDALLY (backwards toward the tail).
    // - Hind limbs (HL, HR): Knees bend CRANIALLY (forwards toward the head).
    this.legs = [
      { id: 'FL', side: -1, attachNode: 3, l1: 14.0, l2: 12.8, bendDir:  1, isHind: false, phaseOffset: 0 },
      { id: 'FR', side:  1, attachNode: 3, l1: 14.0, l2: 12.8, bendDir: -1, isHind: false, phaseOffset: Math.PI },
      { id: 'HL', side: -1, attachNode: 9, l1: 18.0, l2: 16.8, bendDir: -1, isHind: true,  phaseOffset: Math.PI },
      { id: 'HR', side:  1, attachNode: 9, l1: 18.0, l2: 16.8, bendDir:  1, isHind: true,  phaseOffset: 0 },
    ];
  }

  generateDorsalPattern() {
    const spots = [];
    let seed = 4219;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 2; i <= 15; i++) {
      const count = i <= 9 ? 3 : 2;
      for (let s = 0; s < count; s++) {
        spots.push({
          nodeIdx: i,
          lateralOffset: (rand() - 0.5) * 1.18,
          longOffset: (rand() - 0.5) * 0.6,
          rx: 1.8 + rand() * 2.2,
          ry: 1.2 + rand() * 1.6,
          rot: rand() * Math.PI,
          isCyanOcellus: s === 0 && (i === 3 || i === 4 || i === 6 || i === 7 || i === 9),
          isGoldSpeckle: s === 1 && (i >= 4 && i <= 10 && rand() > 0.35),
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
    // Ultra-high definition retina supersampling (min 2.5x pixel density)
    this.dpr = Math.max(window.devicePixelRatio || 1, 2.5);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    if (width < 768) {
      this.scale = this.baseScale * 0.68;
      this.marginRight = 50;
      this.marginTop = 72;
      this.marginBottom = 85;
      this.viewerTarget.x = width * 0.35;
      this.viewerTarget.y = height * 0.48;
    } else if (width < 1024) {
      this.scale = this.baseScale * 0.85;
      this.marginRight = 95;
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

    const swayX = Math.sin(this.walkPhase * 0.5) * 5.0 * s * (1 - this.curlMix) * (1 - this.hissMix);
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

    // Muscular flank attachment offset
    const hipX = node.x + Math.cos(normalAngle) * (node.radius * 0.76);
    const hipY = node.y + Math.sin(normalAngle) * (node.radius * 0.76);

    const l1 = leg.l1 * s;
    const l2 = leg.l2 * s;

    const sleepSpread = (leg.isHind ? 16.0 : 13.5) * s;
    const sleepForward = (leg.isHind ? 6.5 : -5.0) * s;

    const phase = this.walkPhase + leg.phaseOffset;
    const activeStride = 1.0 - this.hissMix * 0.92;
    const strideWave = Math.sin(phase) * activeStride;
    const liftWave = Math.max(0, Math.cos(phase)) * activeStride;

    // Realistic stride kinematics for sprawling lizards
    const strideLength = (leg.isHind ? 13.0 : 11.0) * s * (0.45 + 0.55 * this.walkIntensity);
    const hissStanceSpread = (!leg.isHind ? 4.0 : 2.0) * s * this.hissMix;
    const baseWalkSpread = (leg.isHind ? 20.0 : 17.5) * s + hissStanceSpread;
    const baseWalkForward = (leg.isHind ? -3.5 : 6.0) * s;

    const flipTuck = 1.0 - this.vaultHeight * 0.32;
    const walkSpread = (baseWalkSpread + liftWave * 4.0 * s) * flipTuck;
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

    // Knee / Elbow joint placement using correct biological bendDir
    const kneeAngle = baseAngle + leg.bendDir * alpha;
    const kneeX = hipX + Math.cos(kneeAngle) * l1;
    const kneeY = hipY + Math.sin(kneeAngle) * l1;

    // Foot angle aligns naturally in direction of stride with slight fanning
    const rawLimbAngle = Math.atan2(footY - kneeY, footX - kneeX);
    const anatomicalToeDir = forwardAngle + leg.side * (leg.isHind ? 0.38 : 0.22);
    const footAngle = lerp(anatomicalToeDir, rawLimbAngle, this.curlMix * 0.7);

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
    const snoutLength = head.radius * 1.48;
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

  /**
   * Ultra-HD Muscular Leg Renderer with Anatomical Foot Pads and Gracefully Curved Claws
   */
  drawLeg(ctx, leg) {
    const s = this.scale * (1 + (leg.lift || 0) * 0.05);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Organic Muscled Upper Limb (Femur / Humerus) with Volumetric Shading
    const thW1 = (leg.isHind ? 7.2 : 5.8) * s;
    const thW2 = (leg.isHind ? 4.8 : 4.0) * s;

    const angleHipKnee = Math.atan2(leg.kneeY - leg.hipY, leg.kneeX - leg.hipX);
    const perpUpper = angleHipKnee + Math.PI / 2;

    const u1L = { x: leg.hipX + Math.cos(perpUpper) * thW1, y: leg.hipY + Math.sin(perpUpper) * thW1 };
    const u1R = { x: leg.hipX - Math.cos(perpUpper) * thW1, y: leg.hipY - Math.sin(perpUpper) * thW1 };
    const u2L = { x: leg.kneeX + Math.cos(perpUpper) * thW2, y: leg.kneeY + Math.sin(perpUpper) * thW2 };
    const u2R = { x: leg.kneeX - Math.cos(perpUpper) * thW2, y: leg.kneeY - Math.sin(perpUpper) * thW2 };

    const upperGrad = ctx.createLinearGradient(leg.hipX, leg.hipY, leg.kneeX, leg.kneeY);
    upperGrad.addColorStop(0.0, '#06204E');
    upperGrad.addColorStop(0.35, '#0070D8');
    upperGrad.addColorStop(0.8, '#083880');
    upperGrad.addColorStop(1.0, '#04183E');

    ctx.fillStyle = upperGrad;
    ctx.beginPath();
    ctx.moveTo(u1L.x, u1L.y);
    ctx.quadraticCurveTo((u1L.x + u2L.x) * 0.5 + Math.cos(perpUpper) * 1.5 * s, (u1L.y + u2L.y) * 0.5 + Math.sin(perpUpper) * 1.5 * s, u2L.x, u2L.y);
    ctx.arc(leg.kneeX, leg.kneeY, thW2, perpUpper, perpUpper + Math.PI);
    ctx.lineTo(u1R.x, u1R.y);
    ctx.closePath();
    ctx.fill();

    // 2. Organic Muscled Lower Limb (Crus / Forearm)
    const crW1 = thW2;
    const crW2 = (leg.isHind ? 3.4 : 2.8) * s;

    const angleKneeFoot = Math.atan2(leg.footY - leg.kneeY, leg.footX - leg.kneeX);
    const perpLower = angleKneeFoot + Math.PI / 2;

    const l1L = { x: leg.kneeX + Math.cos(perpLower) * crW1, y: leg.kneeY + Math.sin(perpLower) * crW1 };
    const l1R = { x: leg.kneeX - Math.cos(perpLower) * crW1, y: leg.kneeY - Math.sin(perpLower) * crW1 };
    const l2L = { x: leg.footX + Math.cos(perpLower) * crW2, y: leg.footY + Math.sin(perpLower) * crW2 };
    const l2R = { x: leg.footX - Math.cos(perpLower) * crW2, y: leg.footY - Math.sin(perpLower) * crW2 };

    const lowerGrad = ctx.createLinearGradient(leg.kneeX, leg.kneeY, leg.footX, leg.footY);
    lowerGrad.addColorStop(0.0, '#007CE8');
    lowerGrad.addColorStop(0.5, '#0090FF');
    lowerGrad.addColorStop(1.0, '#073270');

    ctx.fillStyle = lowerGrad;
    ctx.beginPath();
    ctx.moveTo(l1L.x, l1L.y);
    ctx.lineTo(l2L.x, l2L.y);
    ctx.arc(leg.footX, leg.footY, crW2, perpLower, perpLower + Math.PI);
    ctx.lineTo(l1R.x, l1R.y);
    ctx.closePath();
    ctx.fill();

    // Soft muscular joint specular highlight
    ctx.strokeStyle = 'rgba(72, 220, 255, 0.45)';
    ctx.lineWidth = 1.4 * s;
    ctx.beginPath();
    ctx.moveTo(leg.hipX, leg.hipY);
    ctx.quadraticCurveTo(leg.kneeX, leg.kneeY, leg.footX, leg.footY);
    ctx.stroke();

    // 3. Anatomical Palm / Metatarsus Pad (Eliminates single-point bunching)
    const palmWidth = (leg.isHind ? 4.2 : 3.4) * s;
    const palmLength = (leg.isHind ? 3.6 : 3.0) * s;
    const palmAngle = leg.footAngle;
    const palmNormal = palmAngle + Math.PI / 2;

    const palmCenterX = leg.footX + Math.cos(palmAngle) * (palmLength * 0.5);
    const palmCenterY = leg.footY + Math.sin(palmAngle) * (palmLength * 0.5);

    ctx.fillStyle = '#052254';
    ctx.beginPath();
    ctx.ellipse(palmCenterX, palmCenterY, palmLength, palmWidth * 0.75, palmAngle, 0, Math.PI * 2);
    ctx.fill();

    // 4. Natural 5-Digit Paw Kinematics with True Lacertid Proportions
    // Lacertid toe order: Digit IV is longest with elegant arc, Digit I shortest
    const toeAngles = leg.isHind
      ? [-0.55, -0.28, -0.02, 0.28, 0.62]
      : [-0.48, -0.22, 0.0, 0.24, 0.50];

    const toeLengths = leg.isHind
      ? [6.5, 9.5, 13.5, 17.5, 9.8] // Digit IV = 17.5*s (signature long lizard toe)
      : [5.8, 8.2, 11.2, 13.8, 8.0];

    const toeRootOffsets = [-0.75, -0.38, 0.0, 0.38, 0.75];

    for (let t = 0; t < 5; t++) {
      const toeSideAngle = palmNormal * leg.side;
      const rootX = palmCenterX + Math.cos(toeSideAngle) * (toeRootOffsets[t] * palmWidth * 0.75);
      const rootY = palmCenterY + Math.sin(toeSideAngle) * (toeRootOffsets[t] * palmWidth * 0.75);

      const naturalToeDir = palmAngle + toeAngles[t] * leg.side;
      const len = toeLengths[t] * s;

      // Gracefully curved toe path (subtle forward arc)
      const midLen = len * 0.55;
      const midCurvature = 0.08 * leg.side;
      const midX = rootX + Math.cos(naturalToeDir + midCurvature) * midLen;
      const midY = rootY + Math.sin(naturalToeDir + midCurvature) * midLen;

      const tipX = rootX + Math.cos(naturalToeDir) * len;
      const tipY = rootY + Math.sin(naturalToeDir) * len;

      // Toe digit body
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.quadraticCurveTo(midX, midY, tipX, tipY);
      ctx.strokeStyle = '#007BE6';
      ctx.lineWidth = (t === 3 ? 2.2 : 1.7) * s;
      ctx.stroke();

      // Micro-digit highlight
      ctx.strokeStyle = '#52D4FF';
      ctx.lineWidth = (t === 3 ? 1.2 : 0.9) * s;
      ctx.stroke();

      // Sharp, delicate curved claw
      const clawLen = 2.4 * s;
      const clawAngle = naturalToeDir + 0.18 * leg.side;
      const clawX = tipX + Math.cos(clawAngle) * clawLen;
      const clawY = tipY + Math.sin(clawAngle) * clawLen;

      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(clawX, clawY);
      ctx.strokeStyle = '#E2F3FF';
      ctx.lineWidth = 1.0 * s;
      ctx.stroke();

      // Micro claw shadow tip
      ctx.beginPath();
      ctx.arc(clawX, clawY, 0.4 * s, 0, Math.PI * 2);
      ctx.fillStyle = '#061730';
      ctx.fill();
    }

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
      ctx.shadowBlur = 14 * s;
      ctx.shadowOffsetX = -4 * s;
      ctx.shadowOffsetY = 8 * s;
    }

    // Glowing Azure Throat Sac (dilates during IDLE_HISS)
    if (this.throatInflation > 0.02) {
      const gularRadiusX = head.radius * (1.12 + this.throatInflation * 0.55);
      const gularRadiusY = head.radius * (0.98 + this.throatInflation * 0.52);

      const gularGrad = ctx.createRadialGradient(
        head.radius * 0.35,
        0,
        1 * s,
        head.radius * 0.35,
        0,
        gularRadiusY
      );
      gularGrad.addColorStop(0.0, 'rgba(0, 245, 255, 0.92)');
      gularGrad.addColorStop(0.65, 'rgba(0, 115, 240, 0.75)');
      gularGrad.addColorStop(1.0, 'rgba(5, 32, 82, 0.0)');

      ctx.fillStyle = gularGrad;
      ctx.beginPath();
      ctx.ellipse(head.radius * 0.42, 0, gularRadiusX, gularRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gaping Jaws & Bifurcated Hissing Tongue
    if (this.jawOpen > 0.03) {
      const openAmt = this.jawOpen;
      const mouthX = -head.radius * 1.15;
      const mouthLen = head.radius * (0.98 + openAmt * 0.58);
      const mouthWidth = head.radius * (0.64 + openAmt * 0.45);

      const tongueFlick = 0.75 + 0.25 * Math.sin(this.time * 28.0);
      const tongueLen = head.radius * (1.35 + openAmt * 1.25) * tongueFlick;
      const tongueTipX = mouthX - tongueLen;
      const tongueSwayY = Math.sin(this.time * 34.0) * (2.4 * s);
      const forkLen = 4.8 * s;
      const forkSpread = 3.0 * s;

      // Realistic bifurcated tongue with translucent crimson gradient
      ctx.save();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#FF2A6D';
      ctx.lineWidth = 1.65 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mouthX + 2 * s, 0);
      ctx.quadraticCurveTo(mouthX - tongueLen * 0.5, tongueSwayY * 0.5, tongueTipX, tongueSwayY);
      ctx.moveTo(tongueTipX, tongueSwayY);
      ctx.lineTo(tongueTipX - forkLen, tongueSwayY - forkSpread);
      ctx.moveTo(tongueTipX, tongueSwayY);
      ctx.lineTo(tongueTipX - forkLen, tongueSwayY + forkSpread);
      ctx.stroke();

      // Tongue highlight
      ctx.strokeStyle = 'rgba(255, 180, 210, 0.75)';
      ctx.lineWidth = 0.8 * s;
      ctx.beginPath();
      ctx.moveTo(mouthX, 0);
      ctx.lineTo(tongueTipX - forkLen * 0.5, tongueSwayY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#041B46';
      ctx.beginPath();
      ctx.ellipse(mouthX, 0, mouthLen * 1.08, mouthWidth * 1.12, 0, 0, Math.PI * 2);
      ctx.fill();

      const mouthGrad = ctx.createRadialGradient(mouthX, 0, 0.5 * s, mouthX, 0, mouthLen);
      mouthGrad.addColorStop(0.0, '#B8184C');
      mouthGrad.addColorStop(0.65, '#5A0C2B');
      mouthGrad.addColorStop(1.0, '#1E051B');

      ctx.fillStyle = mouthGrad;
      ctx.beginPath();
      ctx.ellipse(mouthX, 0, mouthLen * 0.92, mouthWidth * 0.88 * openAmt, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fine serrated teeth ridge
      ctx.strokeStyle = 'rgba(235, 250, 255, 0.82)';
      ctx.lineWidth = 0.85 * s;
      ctx.setLineDash([1.3 * s, 1.5 * s]);
      ctx.beginPath();
      ctx.ellipse(mouthX, 0, mouthLen * 0.88, mouthWidth * 0.82 * openAmt, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Concentric soundwaves of the audible hiss
      ctx.save();
      ctx.shadowColor = 'transparent';
      for (let w = 0; w < 3; w++) {
        const wavePhase = ((this.time * 2.2 + w * 0.33) % 1.0);
        const waveRadius = (12 + wavePhase * 32) * s;
        const waveAlpha = (1.0 - wavePhase) * openAmt * 0.7;

        ctx.strokeStyle = `rgba(56, 235, 255, ${waveAlpha})`;
        ctx.lineWidth = (2.0 - wavePhase * 1.2) * s;
        ctx.beginPath();
        ctx.arc(mouthX - 4 * s, 0, waveRadius, Math.PI - 0.58, Math.PI + 0.58);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Upper Cranial Plate (Sapphire-Cerulean Polish)
    const upperJawShift = this.jawOpen * head.radius * 0.18;
    const cranialGrad = ctx.createRadialGradient(
      -head.radius * 0.3 + upperJawShift,
      0,
      1 * s,
      -head.radius * 0.2 + upperJawShift,
      0,
      head.radius * 1.1
    );
    cranialGrad.addColorStop(0.0, '#28E0FF');
    cranialGrad.addColorStop(0.45, '#0088F0');
    cranialGrad.addColorStop(0.85, '#07367A');
    cranialGrad.addColorStop(1.0, '#04183E');

    ctx.fillStyle = cranialGrad;
    ctx.beginPath();
    ctx.ellipse(
      -head.radius * 0.25 + upperJawShift,
      0,
      head.radius * 1.05,
      head.radius * 0.74,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Specular Crown Reflection
    ctx.fillStyle = 'rgba(120, 240, 255, 0.45)';
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

    // Nostrils
    const nostrilX = -head.radius * 1.02 + upperJawShift;
    const nostrilSpread = head.radius * 0.34;
    ctx.fillStyle = '#030E22';
    ctx.beginPath();
    ctx.arc(nostrilX, -nostrilSpread, 1.0 * s, 0, Math.PI * 2);
    ctx.arc(nostrilX,  nostrilSpread, 1.0 * s, 0, Math.PI * 2);
    ctx.fill();

    // Gemstone Eyes with Amber Iris and Vertical Slit Pupil
    const eyeX = -head.radius * 0.12 + upperJawShift * 0.5;
    const eyeSpread = head.radius * 0.68;
    const eyeRadiusX = (2.8 + this.hissMix * 0.45) * s;
    const eyeRadiusY = (1.9 + this.hissMix * 0.45) * s;

    [-1, 1].forEach((side) => {
      const ey = side * eyeSpread;

      ctx.fillStyle = '#051E4A';
      ctx.beginPath();
      ctx.ellipse(eyeX, ey, eyeRadiusX, eyeRadiusY, side * 0.2, 0, Math.PI * 2);
      ctx.fill();

      if (this.eyeOpenMix > 0.08) {
        // Vibrant Amber / Gold Gemstone Iris
        const irisGrad = ctx.createRadialGradient(eyeX, ey, 0.2 * s, eyeX, ey, eyeRadiusX * 0.85);
        irisGrad.addColorStop(0.0, this.hissMix > 0.3 ? '#FFAA1D' : '#E89025');
        irisGrad.addColorStop(0.7, '#C26B12');
        irisGrad.addColorStop(1.0, '#5A2805');

        ctx.fillStyle = irisGrad;
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

        // Vertical Slit Reptilian Pupil
        const pupilRx = lerp(eyeRadiusY * 0.55, eyeRadiusY * 0.30, this.hissMix) * this.eyeOpenMix;
        const pupilRy = lerp(eyeRadiusY * 0.55, eyeRadiusY * 0.84, this.hissMix) * this.eyeOpenMix;
        const gazeForwardOffset = -0.45 * s * (1 + this.hissMix * 0.6);

        ctx.fillStyle = '#02060D';
        ctx.beginPath();
        ctx.ellipse(eyeX + gazeForwardOffset, ey, pupilRx, pupilRy, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dual Corneal Specular Highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(
          eyeX + gazeForwardOffset - 0.4 * s,
          ey - 0.4 * s,
          0.65 * s * this.eyeOpenMix,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = 'rgba(200, 245, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(
          eyeX + gazeForwardOffset + 0.35 * s,
          ey + 0.35 * s,
          0.35 * s * this.eyeOpenMix,
          0,
          Math.PI * 2
        );
        ctx.fill();

        if (this.hissMix > 0.1) {
          ctx.strokeStyle = `rgba(3, 14, 38, ${0.85 * this.hissMix})`;
          ctx.lineWidth = 1.35 * s;
          ctx.beginPath();
          ctx.moveTo(eyeX - eyeRadiusX, ey - side * eyeRadiusY * 0.35);
          ctx.lineTo(eyeX + eyeRadiusX * 0.9, ey - side * eyeRadiusY * 0.85);
          ctx.stroke();
        }
      } else {
        // Eyelid line in sleep
        ctx.strokeStyle = '#020C1E';
        ctx.lineWidth = 1.25 * s;
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeRadiusX * 0.85, ey);
        ctx.quadraticCurveTo(eyeX, ey + side * 0.6 * s, eyeX + eyeRadiusX * 0.85, ey);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(110, 240, 255, 0.6)';
        ctx.lineWidth = 0.85 * s;
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

    // 1. Soft Natural Ambient Occlusion Drop Shadow
    ctx.save();
    const elevation = Math.max(this.vaultHeight, this.hissMix * 0.35);
    const shadowAlpha = lerp(0.35, 0.20, elevation);
    ctx.shadowColor = `rgba(2, 10, 28, ${shadowAlpha})`;
    ctx.shadowBlur = (16 + elevation * 18) * s;
    ctx.shadowOffsetX = (-4 - elevation * 6) * s;
    ctx.shadowOffsetY = (8 + elevation * 16) * s;

    // Draw legs into shadow pass
    for (const leg of this.solvedLegs) {
      this.drawLeg(ctx, leg);
    }
    this.traceBodyPath(ctx, contours);
    ctx.fillStyle = '#06204E';
    ctx.fill();
    ctx.restore();

    // 2. Real Limbs Pass: Legs rendered smoothly on flanking planes
    for (const leg of this.solvedLegs) {
      this.drawLeg(ctx, leg);
    }

    // 3. Volumetric Body Pass: Deep Sapphire & Midnight Indigo Livrea
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
      120 * s
    );

    const intensityBoost = Math.max(this.vaultHeight * 0.35, this.throatInflation * 0.45);
    bodyGrad.addColorStop(0.0, intensityBoost > 0.15 ? '#44EAFF' : '#00CAFF');
    bodyGrad.addColorStop(0.28, '#007BE6');
    bodyGrad.addColorStop(0.65, '#07377D');
    bodyGrad.addColorStop(1.0, '#041738');

    ctx.fillStyle = bodyGrad;
    ctx.fillRect(
      this.pos.x - 320 * s,
      this.pos.y - 320 * s,
      640 * s,
      640 * s
    );

    // Subtle vertebral ring segmentation
    ctx.strokeStyle = 'rgba(2, 11, 28, 0.32)';
    ctx.lineWidth = 1.1 * s;
    for (let i = 10; i < this.numNodes - 1; i++) {
      const n = this.spine[i];
      const norm = n.angle + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(n.x - Math.cos(norm) * n.radius, n.y - Math.sin(norm) * n.radius);
      ctx.lineTo(n.x + Math.cos(norm) * n.radius, n.y + Math.sin(norm) * n.radius);
      ctx.stroke();
    }

    // Luxury Dorsal Spots: Melanic Black + Electric Cyan Ocelli + Gold Speckles
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
        // Capri Faraglioni Signature Electric Cyan Ocellus
        ctx.fillStyle = 'rgba(0, 245, 255, 0.95)';
        ctx.beginPath();
        ctx.ellipse(0, 0, spot.rx * 0.9 * s, spot.ry * 0.9 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 120, 255, 0.75)';
        ctx.lineWidth = 0.8 * s;
        ctx.stroke();
      } else if (spot.isGoldSpeckle) {
        // High-Jewelry Cartier Metallic Gold Speckle
        ctx.fillStyle = 'rgba(224, 185, 80, 0.82)';
        ctx.beginPath();
        ctx.ellipse(0, 0, spot.rx * 0.65 * s, spot.ry * 0.65 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Deep Obsidian Melanic Spot
        ctx.fillStyle = 'rgba(3, 7, 16, 0.85)';
        ctx.beginPath();
        ctx.ellipse(0, 0, spot.rx * s, spot.ry * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3D Volumetric Dorsal Specular Highlight
    ctx.beginPath();
    for (let i = 0; i < this.numNodes - 2; i++) {
      const n = this.spine[i];
      const lx = n.x + Math.cos(n.angle - Math.PI / 2) * (n.radius * 0.22);
      const ly = n.y + Math.sin(n.angle - Math.PI / 2) * (n.radius * 0.22);
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.strokeStyle = 'rgba(160, 245, 255, 0.50)';
    ctx.lineWidth = 2.8 * s;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();

    // Body silhouette outline definition
    this.traceBodyPath(ctx, contours);
    ctx.strokeStyle = 'rgba(2, 14, 40, 0.6)';
    ctx.lineWidth = 1.0 * s;
    ctx.stroke();

    // 4. Photorealistic Head & Eye Detailing
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
