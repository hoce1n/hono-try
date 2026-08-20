import { defaultCard } from "./defaults.js";
import type { Card } from "../types/card.js";

export interface CardRepository {
  findById(cardId: string): Card | undefined;
}

export const cards: Readonly<Record<string, Card>> = {
  [defaultCard.id]: defaultCard,
  "coffee-date": {
    id: "coffee-date",
    pageTitle: "A Coffee Date Question",
    question: "Would you make our next coffee a date? ☕",
    responseOptionsLabel: "Coffee date responses",
    yesLabel: "Let’s go",
    noLabel: "Maybe later",
    successMessage: "Coffee and great company—it’s a date! ☕",
    theme: "pink",
  },
  stargazing: {
    id: "stargazing",
    pageTitle: "A Stargazing Question",
    question: "Would you go stargazing with me? ✨",
    responseOptionsLabel: "Stargazing responses",
    yesLabel: "Under the stars",
    noLabel: "Rain check",
    successMessage: "A night under the stars sounds perfect! ✨",
    theme: "purple",
  },
  "midnight-movie": {
    id: "midnight-movie",
    pageTitle: "A Movie Night Question",
    question: "Want to pick a movie and make it a cozy night? 🎬",
    responseOptionsLabel: "Movie night responses",
    yesLabel: "Movie night",
    noLabel: "Not tonight",
    successMessage: "Popcorn is on me—see you at movie night! 🎬",
    theme: "dark",
  },
};

export const inMemoryCardRepository: CardRepository = {
  findById(cardId) {
    return cards[cardId];
  },
};

export function getCardById(cardId: string): Card | undefined {
  return inMemoryCardRepository.findById(cardId);
}
