import { GameState } from './types';
import { getCardDef } from './cards';
import { canPlayCard, playCard, discardCard, deepCloneState, checkWinConditions } from './turnManager';

function scoreCard(state: GameState, cardUid: number): number {
  const pi = state.currentPlayer;
  const player = state.players[pi];
  const opp = state.players[pi === 0 ? 1 : 0];
  const cardInst = player.hand.find(c => c.uid === cardUid);
  if (!cardInst) return -1000;

  const def = getCardDef(cardInst.definitionId);

  // Can't afford it
  const resource = def.resourceType === 'bricks' ? player.bricks
    : def.resourceType === 'gems' ? player.gems
    : player.recruits;
  if (resource < def.cost) return -1000;

  // Simulate the play
  const simState = deepCloneState(state);
  const result = playCard(simState, cardUid);
  const afterCheck = checkWinConditions(result);

  // Instant win = max priority
  if (afterCheck.phase === 'gameOver' && afterCheck.winner === pi) {
    return 10000;
  }

  const simPlayer = result.players[pi];
  const simOpp = result.players[pi === 0 ? 1 : 0];

  let score = 0;

  // Castle gain (own)
  score += (simPlayer.castle - player.castle) * 1.5;

  // Wall gain (own)
  score += (simPlayer.wall - player.wall) * 1.0;

  // Opponent castle damage
  score += (opp.castle - simOpp.castle) * 2.0;

  // Opponent wall damage
  score += (opp.wall - simOpp.wall) * 0.8;

  // Generator gain (very valuable)
  score += (simPlayer.quarry - player.quarry) * 8;
  score += (simPlayer.magic - player.magic) * 8;
  score += (simPlayer.dungeon - player.dungeon) * 8;

  // Opponent generator loss
  score += (opp.quarry - simOpp.quarry) * 6;
  score += (opp.magic - simOpp.magic) * 6;
  score += (opp.dungeon - simOpp.dungeon) * 6;

  // Resource gain
  score += (simPlayer.bricks - player.bricks + def.cost * (def.resourceType === 'bricks' ? 1 : 0)) * 0.3;
  score += (simPlayer.gems - player.gems + def.cost * (def.resourceType === 'gems' ? 1 : 0)) * 0.3;
  score += (simPlayer.recruits - player.recruits + def.cost * (def.resourceType === 'recruits' ? 1 : 0)) * 0.3;

  // Play again bonus
  if (def.playAgain) score += 3;

  // Defense urgency - prefer defensive cards when low HP
  if (player.castle < 15 && player.wall < 5) {
    score += (simPlayer.castle - player.castle) * 2;
    score += (simPlayer.wall - player.wall) * 2;
  }

  // Prefer cheaper cards slightly (efficiency)
  score -= def.cost * 0.1;

  return score;
}

export function aiChooseAction(state: GameState): { action: 'play' | 'discard'; cardUid: number } {
  const pi = state.currentPlayer;
  const hand = state.players[pi].hand;

  // Score all playable cards
  let bestScore = -Infinity;
  let bestUid = hand[0].uid;
  let canPlayAny = false;

  for (const card of hand) {
    if (canPlayCard(state, card.uid)) {
      canPlayAny = true;
      const score = scoreCard(state, card.uid);
      if (score > bestScore) {
        bestScore = score;
        bestUid = card.uid;
      }
    }
  }

  if (canPlayAny && bestScore > -1000) {
    return { action: 'play', cardUid: bestUid };
  }

  // Discard the least useful card (highest cost we can't afford)
  let worstUid = hand[0].uid;
  let worstValue = Infinity;
  for (const card of hand) {
    const def = getCardDef(card.definitionId);
    // Lower score = discard first
    const value = def.cost * (def.resourceType === 'bricks' ? 1 : def.resourceType === 'gems' ? 1.1 : 1.05);
    if (value < worstValue) {
      worstValue = value;
      worstUid = card.uid;
    }
  }

  return { action: 'discard', cardUid: worstUid };
}

export function executeAiTurn(state: GameState): GameState {
  const { action, cardUid } = aiChooseAction(state);
  if (action === 'play') {
    return playCard(state, cardUid);
  } else {
    return discardCard(state, cardUid);
  }
}
