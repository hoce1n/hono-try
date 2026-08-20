import { defaultCard } from "../config/defaults.js";
import type { Card, Theme } from "../types/card.js";

export type CustomCardInput = Record<string, string | undefined>;

const textLimits = {
  question: 180,
  successMessage: 180,
  yesLabel: 40,
  noLabel: 40,
} as const;

function normalizeText(value: string | undefined, fallback: string, maximumLength: number): string {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return fallback;
  }

  return trimmedValue.slice(0, maximumLength);
}

function isTheme(value: string | undefined): value is Theme {
  return value === "pink" || value === "purple" || value === "dark";
}

export function createCustomCard(input: CustomCardInput): Card {
  return {
    ...defaultCard,
    id: "custom",
    question: normalizeText(input.question, defaultCard.question, textLimits.question),
    successMessage: normalizeText(input.success, defaultCard.successMessage, textLimits.successMessage),
    yesLabel: normalizeText(input.yes, defaultCard.yesLabel, textLimits.yesLabel),
    noLabel: normalizeText(input.no, defaultCard.noLabel, textLimits.noLabel),
    theme: isTheme(input.theme) ? input.theme : defaultCard.theme,
  };
}

export function createShareQuery(card: Card): URLSearchParams {
  return new URLSearchParams({
    question: card.question,
    success: card.successMessage,
    theme: card.theme ?? "pink",
    yes: card.yesLabel,
    no: card.noLabel,
  });
}
