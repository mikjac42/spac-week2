import { Card, Suit, Rank } from './card';

export interface DeckOptions {
  numberOfDecks?: number;
}

export class Deck {
  private cards: Card[];
  private readonly numberOfDecks: number;
  private readonly numberOfCardsTotal: number;
  private static readonly DEFAULT_NUM_DECKS = 8;

  constructor(options: DeckOptions = {}) {
    this.numberOfDecks = options.numberOfDecks || Deck.DEFAULT_NUM_DECKS;
    this.numberOfCardsTotal = this.numberOfDecks * Object.values(Suit).length * Object.values(Rank).length;
    this.cards = [];
    this.initializeDeck();
  }

  /**
   * Initializes the deck with the specified number of card sets
   */
  private initializeDeck(): void {
    this.cards = [];
    
    // For each deck, add a card of each suit and rank
    for (let deckIndex = 0; deckIndex < this.numberOfDecks; deckIndex++) {
      for (const suit of Object.values(Suit)) {
        for (const rank of Object.values(Rank)) {
          this.cards.push(new Card(suit, rank));
        }
      }
    }
  }

  /**
   * Shuffles the deck using the Fisher-Yates algorithm
   */
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Deals a single card from the top of the deck
   * @returns The dealt card, or null if deck is empty
   */
  dealCard(): Card | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.cards.pop() || null;
  }

  /**
   * Deals multiple cards from the deck
   * @param count Number of cards to deal
   * @returns Array of dealt cards (may be fewer than requested if deck runs out)
   */
  dealCards(count: number): Card[] {
    const dealtCards: Card[] = [];
    for (let i = 0; i < count && !this.isEmpty(); i++) {
      const card = this.dealCard();
      if (card) {
        dealtCards.push(card);
      }
    }
    return dealtCards;
  }

  /**
   * Returns true if the deck is empty
   */
  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  /**
   * Returns the number of cards remaining in the deck
   */
  getRemainingNumberOfCards(): number {
    return this.cards.length;
  }

  /**
   * Returns the total number of cards this deck was initialized with
   */
  getNumberOfCardsTotal(): number {
    return this.numberOfCardsTotal;
  }

  /**
   * Returns the number of decks this deck was initialized with
   */
  getNumberOfDecks(): number {
    return this.numberOfDecks;
  }

  /**
   * Resets the deck to its original state and shuffles
   */
  reset(): void {
    this.initializeDeck();
    this.shuffle();
  }
}