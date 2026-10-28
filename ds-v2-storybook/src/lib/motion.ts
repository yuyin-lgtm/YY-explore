/**
 * UI Arc motion presets used by Reacher DS v2.
 * Values match `@uiarc/arc-motion-tokens` (MIT © 2026 Elia Kuratli) and the DS v2 handoff.
 * Durations are seconds for the `motion` package; CSS variables in tokens.css are the millisecond twins.
 */
export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.16,
    exit: 0.18,
    standard: 0.24,
    considered: 0.48,
    spring: 0.58,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    standard: [0.22, 1, 0.36, 1] as const,
    exit: [0.7, 0, 0.84, 0] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  },
  spring: {
    snappy: { type: "spring" as const, visualDuration: 0.26, bounce: 0 },
    smooth: { type: "spring" as const, visualDuration: 0.4, bounce: 0 },
    morph: { type: "spring" as const, visualDuration: 0.42, bounce: 0 },
    responsive: { type: "spring" as const, stiffness: 520, damping: 44 },
    gentle: { type: "spring" as const, stiffness: 340, damping: 34 },
  },
  stagger: { char: 0.016, word: 0.04, line: 0.08, item: 0.035 },
  blur: { subtle: 2, soft: 4, text: 8 },
};

/** Fades only. No size or position travel. */
export const reducedFade = { duration: 0.15, ease: "linear" as const };
export const reducedFadeOut = { duration: 0.1, ease: "linear" as const };
