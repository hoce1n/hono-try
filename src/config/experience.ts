export const cardExperience = {
  noButton: {
    proximityDistance: 120,
    escapeDistance: 150,
    minimumScale: 0.45,
    shrinkStep: 0.12,
    viewportPadding: 16,
  },
  confetti: {
    count: 96,
    durationMs: 2600,
    particleSize: {
      minimum: 7,
      maximum: 13,
    },
  },
} as const;
