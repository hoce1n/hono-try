import type { Theme } from "../types/card.js";

export type ThemeDefinition = {
  colorScheme: "light" | "dark";
  cssVariables: Record<`--${string}`, string>;
  confettiColors: readonly string[];
};

export const DEFAULT_THEME: Theme = "pink";

export const themeDefinitions = {
  pink: {
    colorScheme: "light",
    cssVariables: {
      "--page-background": "radial-gradient(circle at 15% 15%, rgb(255 255 255 / 54%), transparent 28rem), linear-gradient(135deg, #f4a7c5 0%, #b797e8 100%)",
      "--card-background": "rgb(255 255 255 / 94%)",
      "--card-border": "rgb(255 255 255 / 65%)",
      "--card-shadow": "rgb(60 28 49 / 25%)",
      "--text-primary": "#3d2733",
      "--yes-background": "#138a4b",
      "--yes-background-hover": "#0e713d",
      "--yes-shadow": "rgb(19 138 75 / 24%)",
      "--yes-shadow-hover": "rgb(19 138 75 / 30%)",
      "--no-background": "#d9445a",
      "--no-shadow": "rgb(217 68 90 / 20%)",
      "--focus-outline": "#3c1c6f",
    },
    confettiColors: ["#ff4d8d", "#ff7eb6", "#ffd166", "#72ddf7", "#8ce99a", "#a78bfa"],
  },
  purple: {
    colorScheme: "light",
    cssVariables: {
      "--page-background": "radial-gradient(circle at 85% 10%, rgb(255 255 255 / 40%), transparent 26rem), linear-gradient(135deg, #6f4ab7 0%, #b87ad9 52%, #efb7d8 100%)",
      "--card-background": "rgb(255 255 255 / 95%)",
      "--card-border": "rgb(255 255 255 / 72%)",
      "--card-shadow": "rgb(37 17 70 / 30%)",
      "--text-primary": "#2f1b4a",
      "--yes-background": "#6941c6",
      "--yes-background-hover": "#5332a3",
      "--yes-shadow": "rgb(105 65 198 / 26%)",
      "--yes-shadow-hover": "rgb(105 65 198 / 34%)",
      "--no-background": "#b93877",
      "--no-shadow": "rgb(185 56 119 / 23%)",
      "--focus-outline": "#35116d",
    },
    confettiColors: ["#7c5ce0", "#c084fc", "#f0abfc", "#f9a8d4", "#fde68a", "#67e8f9"],
  },
  dark: {
    colorScheme: "dark",
    cssVariables: {
      "--page-background": "radial-gradient(circle at 20% 10%, rgb(86 53 143 / 45%), transparent 26rem), linear-gradient(135deg, #151126 0%, #292047 54%, #41265c 100%)",
      "--card-background": "rgb(34 27 54 / 94%)",
      "--card-border": "rgb(217 202 255 / 22%)",
      "--card-shadow": "rgb(0 0 0 / 45%)",
      "--text-primary": "#f8f5ff",
      "--yes-background": "#4bc78b",
      "--yes-background-hover": "#36a975",
      "--yes-shadow": "rgb(75 199 139 / 22%)",
      "--yes-shadow-hover": "rgb(75 199 139 / 30%)",
      "--no-background": "#e76782",
      "--no-shadow": "rgb(231 103 130 / 22%)",
      "--focus-outline": "#d8b4fe",
    },
    confettiColors: ["#d8b4fe", "#a78bfa", "#f0abfc", "#67e8f9", "#86efac", "#fde68a"],
  },
} as const satisfies Record<Theme, ThemeDefinition>;

export function resolveTheme(theme: Theme | undefined): Theme {
  return theme ?? DEFAULT_THEME;
}
