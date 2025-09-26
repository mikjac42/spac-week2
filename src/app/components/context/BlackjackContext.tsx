import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Deck } from '../../models/deck';
import { Card } from '../../models/card';

export enum GameStatus {
  BETTING = 'betting',
  DEALING = 'dealing',
  PLAYER_TURN = 'playerTurn',
  DEALER_TURN = 'dealerTurn',
  FINISHED = 'finished',
}

interface BlackjackContextType {
  deck: Deck;
  playerHand: Card[];
  dealerHand: Card[];
  gameStatus: GameStatus;
  currentBet: number;
  originalBet: number;
  totalChips: number;
  gamesPlayed: number;
  gamesWon: number;
  setDeck: (deck: Deck) => void;
  setPlayerHand: (hand: Card[]) => void;
  setDealerHand: (hand: Card[]) => void;
  setGameStatus: (status: GameStatus) => void;
  setCurrentBet: (bet: number) => void;
  setOriginalBet: (bet: number) => void;
  setTotalChips: (chips: number) => void;
  setGamesPlayed: (games: number) => void;
  setGamesWon: (wins: number) => void;
}

const BlackjackContext = createContext<BlackjackContextType | undefined>(undefined);

export const BlackjackContextProvider = ({ children }: { children: ReactNode }) => {
  const [deck, setDeck] = useState<Deck>(new Deck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.BETTING);
  const [currentBet, setCurrentBet] = useState<number>(10);
  const [originalBet, setOriginalBet] = useState<number>(10);
  const [totalChips, setTotalChips] = useState<number>(1000);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [gamesWon, setGamesWon] = useState<number>(0);

  const value: BlackjackContextType = {
    deck,
    playerHand,
    dealerHand,
    gameStatus,
    currentBet,
    originalBet,
    totalChips,
    gamesPlayed,
    gamesWon,
    setDeck,
    setPlayerHand,
    setDealerHand,
    setGameStatus,
    setCurrentBet,
    setOriginalBet,
    setTotalChips,
    setGamesPlayed,
    setGamesWon,
  };

  return (
    <BlackjackContext.Provider value={value}>
      {children}
    </BlackjackContext.Provider>
  );
};

export const useBlackjack = () => {
  const context = useContext(BlackjackContext);
  if (context === undefined) {
    throw new Error('useBlackjack must be used within a BlackjackProvider');
  }
  return context;
};
