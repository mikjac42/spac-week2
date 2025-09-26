import { Card, Rank } from '../models/card';
import { Deck } from '../models/deck';

export enum GameOutcome {
  PLAYER_WIN = 'playerWin',
  DEALER_WIN = 'dealerWin',
  PUSH = 'push',
  PLAYER_BLACKJACK = 'playerBlackjack',
  DEALER_BLACKJACK = 'dealerBlackjack',
  PLAYER_BUST = 'playerBust',
  DEALER_BUST = 'dealerBust'
}

export enum HandType {
  SOFT = 'soft',
  HARD = 'hard'
}

export interface HandValue {
  value: number;
  type: HandType;
  isBust: boolean;
  isBlackjack: boolean;
}

export interface GameResult {
  outcome: GameOutcome;
  playerValue: HandValue;
  dealerValue: HandValue;
  winAmount?: number;
}

export abstract class BlackjackService {
  private static readonly BLACKJACK_TARGET = 21;
  private static readonly DEALER_STAND_VALUE = 17;

  /**
   * Calculates the value of a hand, handling aces properly
   */
  static calculateHandValue(cards: Card[]): HandValue {
    if (cards.length === 0) {
      return {
        value: 0,
        type: HandType.HARD,
        isBust: false,
        isBlackjack: false
      };
    }

    let total = 0;
    let aces = 0;

    // Count aces and add up other card values
    for (const card of cards) {
      const cardValue = card.getBlackjackValue();
      if (card.getRank() === Rank.ACE) {
        aces++;
      }
      total += cardValue;
    }

    // Adjust for aces - convert from 11 to 1 as needed
    let adjustedAces = 0;
    while (total > this.BLACKJACK_TARGET && adjustedAces < aces) {
      total -= 10; // Convert an ace from 11 to 1
      adjustedAces++;
    }

    const isSoft = aces > 0 && adjustedAces < aces; // Has at least one ace counted as 11
    const isBust = total > this.BLACKJACK_TARGET;
    const isBlackjack = cards.length === 2 && total === this.BLACKJACK_TARGET;

    return {
      value: total,
      type: isSoft ? HandType.SOFT : HandType.HARD,
      isBust,
      isBlackjack
    };
  }

  /**
   * Determines if the dealer should hit based on their hand
   */
  static shouldDealerHit(dealerCards: Card[]): boolean {
    const handValue = this.calculateHandValue(dealerCards);
    
    // Dealer hits on soft 17 (standard rule in most casinos)
    if (handValue.value < this.DEALER_STAND_VALUE) {
      return true;
    }
    
    if (handValue.value === this.DEALER_STAND_VALUE && handValue.type === HandType.SOFT) {
      return true; // Hit on soft 17
    }
    
    return false;
  }

  /**
   * Determines if a hand can double down (typically first two cards only)
   */
  static canDoubleDown(cards: Card[]): boolean {
    return cards.length === 2;
  }

  /**
   * Calculates the game result after both hands are complete
   */
  static determineGameResult(playerCards: Card[], dealerCards: Card[], bet: number = 0): GameResult {
    const playerValue = this.calculateHandValue(playerCards);
    const dealerValue = this.calculateHandValue(dealerCards);

    let outcome: GameOutcome;
    let winAmount = 0;

    // Check for busts first
    if (playerValue.isBust) {
      outcome = GameOutcome.PLAYER_BUST;
      winAmount = -bet;
    } else if (dealerValue.isBust) {
      outcome = GameOutcome.DEALER_BUST;
      winAmount = bet;
    }
    // Check for blackjacks
    else if (playerValue.isBlackjack && dealerValue.isBlackjack) {
      outcome = GameOutcome.PUSH;
      winAmount = 0;
    } else if (playerValue.isBlackjack) {
      outcome = GameOutcome.PLAYER_BLACKJACK;
      winAmount = bet * 1.5; // Blackjack pays 3:2
    } else if (dealerValue.isBlackjack) {
      outcome = GameOutcome.DEALER_BLACKJACK;
      winAmount = -bet;
    }
    // Compare values
    else if (playerValue.value > dealerValue.value) {
      outcome = GameOutcome.PLAYER_WIN;
      winAmount = bet;
    } else if (dealerValue.value > playerValue.value) {
      outcome = GameOutcome.DEALER_WIN;
      winAmount = -bet;
    } else {
      outcome = GameOutcome.PUSH;
      winAmount = 0;
    }

    return {
      outcome,
      playerValue,
      dealerValue,
      winAmount
    };
  }

  /**
   * Initializes a new game by creating and shuffling a deck
   */
  static initializeGame(numberOfDecks: number = 8): Deck {
    const deck = new Deck({ numberOfDecks });
    deck.shuffle();
    return deck;
  }

  /**
   * Deals initial cards for a new round
   */
  static dealInitialCards(deck: Deck): { playerCards: Card[], dealerCards: Card[] } {
    const playerCards: Card[] = [];
    const dealerCards: Card[] = [];

    // Deal in alternating pattern: player, dealer, player, dealer
    for (let i = 0; i < 2; i++) {
      const playerCard = deck.dealCard();
      const dealerCard = deck.dealCard();
      
      if (!playerCard || !dealerCard) {
        throw new Error('Not enough cards in deck');
      }
      
      playerCards.push(playerCard);
      dealerCards.push(dealerCard);
    }

    return { playerCards, dealerCards };
  }

  /**
   * Plays out the dealer's hand according to standard rules
   */
  static playDealerHand(deck: Deck, dealerCards: Card[]): Card[] {
    const finalHand = [...dealerCards];
    
    while (this.shouldDealerHit(finalHand)) {
      const card = deck.dealCard();
      if (!card) {
        throw new Error('Deck ran out of cards during dealer play');
      }
      finalHand.push(card);
    }
    
    return finalHand;
  }

  /**
   * Validates if a player can hit (not bust, game still active)
   */
  static canPlayerHit(playerCards: Card[]): boolean {
    const handValue = this.calculateHandValue(playerCards);
    return !handValue.isBust && handValue.value < this.BLACKJACK_TARGET;
  }

  /**
   * Checks if the deck needs to be reshuffled ( < 25% cards remain)
   */
  static needsReshuffle(deck: Deck): boolean {
    const remainingPercentage = deck.getRemainingNumberOfCards() / deck.getNumberOfCardsTotal();
    return remainingPercentage < 0.25;
  }

  /**
   * Formats hand value for display
   */
  static formatHandValue(handValue: HandValue): string {
    if (handValue.isBlackjack) {
      return 'Blackjack!';
    }
    if (handValue.isBust) {
      return `Bust (${handValue.value})`;
    }
    if (handValue.type === HandType.SOFT && handValue.value !== 21) {
      return `Soft ${handValue.value}`;
    }
    return handValue.value.toString();
  }

  /**
   * Gets the display name for a game outcome
   */
  static getOutcomeDisplayName(outcome: GameOutcome): string {
    switch (outcome) {
      case GameOutcome.PLAYER_WIN:
        return 'Player Wins!';
      case GameOutcome.DEALER_WIN:
        return 'Dealer Wins';
      case GameOutcome.PUSH:
        return 'Push';
      case GameOutcome.PLAYER_BLACKJACK:
        return 'Player Blackjack!';
      case GameOutcome.DEALER_BLACKJACK:
        return 'Dealer Blackjack';
      case GameOutcome.PLAYER_BUST:
        return 'Player Bust';
      case GameOutcome.DEALER_BUST:
        return 'Dealer Bust - Player Wins!';
      default:
        return 'Game Over';
    }
  }
}