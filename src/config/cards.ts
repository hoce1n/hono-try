import { defaultCard } from "./defaults.js";
import type { Card } from "../types/card.js";

export const cards: Readonly<Record<string, Card>> = {
  [defaultCard.id]: defaultCard,
};

export function getCardById(cardId: string): Card | undefined {
  return cards[cardId];
}
