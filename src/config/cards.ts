import { defaultCard } from "./defaults.js";
import type { Card } from "../types/card.js";

export interface CardRepository {
  findById(cardId: string): Card | undefined;
}

export const cards: Readonly<Record<string, Card>> = {
  [defaultCard.id]: defaultCard,
};

export const inMemoryCardRepository: CardRepository = {
  findById(cardId) {
    return cards[cardId];
  },
};

export function getCardById(cardId: string): Card | undefined {
  return inMemoryCardRepository.findById(cardId);
}
