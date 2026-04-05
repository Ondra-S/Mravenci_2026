import { CardInstance } from './types';
import { CARD_DEFINITIONS } from './cards';

let globalUid = 1;

export function resetUid(): void {
  globalUid = 1;
}

export function nextUid(): number {
  return globalUid++;
}

export function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createDeck(): CardInstance[] {
  const cards: CardInstance[] = [];
  // 3 copies of each card = 90 cards total
  for (let copy = 0; copy < 3; copy++) {
    for (const def of CARD_DEFINITIONS) {
      cards.push({ uid: nextUid(), definitionId: def.id });
    }
  }
  return shuffle(cards);
}

export function drawCards(deck: CardInstance[], count: number): { drawn: CardInstance[]; remaining: CardInstance[] } {
  if (deck.length < count) {
    // Reshuffle new deck and add to existing
    const newDeck = createDeck();
    deck = [...deck, ...newDeck];
  }
  return {
    drawn: deck.slice(0, count),
    remaining: deck.slice(count),
  };
}

export function drawOne(deck: CardInstance[]): { card: CardInstance; remaining: CardInstance[] } {
  const { drawn, remaining } = drawCards(deck, 1);
  return { card: drawn[0], remaining };
}
