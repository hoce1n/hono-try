import type { Card, Theme } from "../types/card.js";

export const DEFAULT_THEME: Theme = "pink";
export const DEFAULT_PAGE_TITLE = "A Question For You";
export const DEFAULT_RESPONSE_OPTIONS_LABEL = "Response options";
export const DEFAULT_YES_LABEL = "YES";
export const DEFAULT_NO_LABEL = "NO";

export const defaultCard: Card = {
  pageTitle: DEFAULT_PAGE_TITLE,
  question: "Do you want to go on a date with me? 💕",
  responseOptionsLabel: DEFAULT_RESPONSE_OPTIONS_LABEL,
  yesLabel: DEFAULT_YES_LABEL,
  noLabel: DEFAULT_NO_LABEL,
  successMessage: "🎉 Yay! You said YES! 🎉",
  theme: DEFAULT_THEME,
};
