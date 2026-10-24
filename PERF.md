# Performance log

Measured on the static export (`out/`) in headless Chrome over the DevTools protocol, Intel Iris Xe, 1440x900.
"4x" = DevTools CPU throttle (a mid-range laptop). Read this before trying a new optimisation.

## 2026-10-24: smoothness pass

| Change | Before → After | Verdict |
|---|---|---|
| Pause looping CSS animations in off-screen sections (`[data-offscreen]`, set in RevealOnScroll) | Projects at rest, 4x: main-frame work 1733 → 1120 ms per 3 s, Layerize 533 → 184 ms | kept |
| Lanyard: compile shaders in the background (`compileAsync`, PMREM pre-warm with its real geometry) before the first frame | Blocking shader compile at load 2054 → 214 ms (real time, not throttled) | kept |
| Robot and orb scenes: `Precompile` (compileAsync + one off-screen frame) on mount | Freeze when scrolling into About ~860 → 0 ms, into Contact ~645 → 0 ms | kept |
| Mount the Contact orb at idle instead of during the hero intro | Its ~150 ms geometry build leaves the intro | kept |
| Robot ContactShadows rendered once (`frames={1}`) | About GPU 1278 → 932 ms per 3 s | kept |
| Robot rig reads cached `matrixWorld` instead of `getWorldPosition`/`getWorldQuaternion` | About at rest, 4x: 70 → 88 frames per 3 s | kept |
| Skills canvas redraws at half rate while nothing is touched or moving fast | At DPR 2: 29 → 59 fps; at DPR 1.5: 40 → 59 fps | kept |
| TechText canvas offset with `transform` instead of `left`/`top` | CLS 0.271 → 0 | kept |
| About clock in its own component; Crate edge material memoised | Stops a whole-section + 3D scene re-render (and 3 leaked materials) every second | kept |

Whole page, 4x throttle: longest load task 2633 → 997 ms, LCP 1252 → 1104 ms, janky scroll frames (>25 ms) 128 → 84–108
over three runs, About at rest 24 → 34–58 fps.

### Tried and reverted (don't retry without new evidence)

| Idea | Result | Why |
|---|---|---|
| `will-change` on the pulse/spin/caret animations | Layerize 533 → 506 ms | Inside noise; any ticking animation still forces a layer pass |
| Pulse via `transform: scale` instead of opacity | Layerize 533 → 518 ms | Same reason |
| Skills glow as a radial-gradient halo instead of `shadowBlur` | GPU −13% but main-thread JS +38% | 40 new 4-stop gradients per frame cost more JS; halo is CSS px while `shadowBlur` is device px, so it looked wider on HiDPI |
| `content-visibility: auto` on sections | not shipped | Would shift ScrollTrigger start/end points and menu anchor targets as sections render |

### Known remaining costs

- The robot and orb warm-up frames still block ~0.5 s each, now at idle after load instead of mid-scroll. On Windows,
  ANGLE finishes some shaders only at the first draw for the model's compressed vertex formats.
- One Lanyard card program still blocks ~190 ms when the card first appears.
- Headless Chrome runs at DPR 1; canvas GPU cost is 2.25–4x higher on 1.5–2x screens, so check canvas changes with
  `Emulation.setDeviceMetricsOverride`.
