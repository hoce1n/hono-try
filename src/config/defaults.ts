import type { Card, Theme } from "../types/card.ts"

export const DEFAULT_THEME: Theme = "pink";
export const DEFAULT_YES_LABEL = "YES";
export const DEFAULT_NO_LABEL = "NO";

export const defaultCard: Card = {
    question: "Do you want to go on a date with me? 💕",
    successMessage: "🎉 Yay! You said YES! 🎉",
    theme: DEFAULT_THEME,
    yesLabel: DEFAULT_YES_LABEL,
    noLabel: DEFAULT_NO_LABEL
}