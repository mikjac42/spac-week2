export enum Suit {
  CLUBS = 'clubs',
  DIAMONDS = 'diamonds',
  HEARTS = 'hearts',
  SPADES = 'spades'
}

export enum Rank {
  ACE = 'ace',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'jack',
  QUEEN = 'queen',
  KING = 'king'
}

export class Card {
  private readonly suit: Suit;
  private readonly rank: Rank;

  constructor(suit: Suit, rank: Rank) {
    this.suit = suit;
    this.rank = rank;
  }

  /**
   * Gets the suit of the card
   */
  getSuit(): Suit {
    return this.suit;
  }

  /**
   * Gets the rank of the card
   */
  getRank(): Rank {
    return this.rank;
  }

  /**
   * Gets the blackjack value of the card
   * Aces return 11 (soft value), face cards return 10
   */
  getBlackjackValue(): number {
    switch (this.rank) {
      case Rank.ACE:
        return 11; // Soft ace value - game logic should handle ace conversion
      case Rank.TWO:
        return 2;
      case Rank.THREE:
        return 3;
      case Rank.FOUR:
        return 4;
      case Rank.FIVE:
        return 5;
      case Rank.SIX:
        return 6;
      case Rank.SEVEN:
        return 7;
      case Rank.EIGHT:
        return 8;
      case Rank.NINE:
        return 9;
      case Rank.TEN:
      case Rank.JACK:
      case Rank.QUEEN:
      case Rank.KING:
        return 10;
      default:
        return 0;
    }
  }
}