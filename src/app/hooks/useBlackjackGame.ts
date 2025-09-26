import { useCallback, useEffect, useRef } from 'react';
import { useBlackjack } from '../components/context/BlackjackContext';
import { GameStatus } from '../components/context/BlackjackContext';
import { BlackjackService, GameOutcome } from '../services/blackjackService';

/**
 * Custom hook that provides game logic and actions for the blackjack game
 * This connects the UI components to the game service and context
 */
export const useBlackjackGame = () => {
  const {
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
  } = useBlackjack();

  /**
   * Adjusts the current bet to the highest affordable amount if necessary
   */
  const adjustBetIfNeeded = useCallback((chipTotal: number) => {
    const betAmounts = [5, 10, 25, 50, 100, 500];
    
    if (currentBet > chipTotal) {
      // Find the highest affordable bet amount
      const affordableBets = betAmounts.filter(amount => amount <= chipTotal);
      const newBet = affordableBets.length > 0 ? Math.max(...affordableBets) : 5; // Default to 5 if no amounts are affordable
      
      setCurrentBet(newBet);
      setOriginalBet(newBet);
      
      return newBet;
    }
    return currentBet;
  }, [currentBet, setCurrentBet, setOriginalBet]);

  /**
   * Starts a new game by initializing deck and dealing initial cards
   */
  const startNewGame = useCallback(() => {
    // Check if player has enough chips for current bet
    if (currentBet > totalChips) {
      console.error('Not enough chips for current bet');
      return;
    }
    
    // Store the original bet amount for this game
    setOriginalBet(currentBet);
    
    // Check if deck needs reshuffling (less than 23 cards remaining)
    let currentDeck = deck;
    if (deck.getRemainingNumberOfCards() < 23) {
      // Initialize new deck only when current deck is too low
      const newDeck = BlackjackService.initializeGame(8); // 8 decks
      setDeck(newDeck);
      currentDeck = newDeck;
    }
    
    // Clear hands
    setPlayerHand([]);
    setDealerHand([]);
    
    // Set status to dealing
    setGameStatus(GameStatus.DEALING);
    
    // Deal initial cards with a slight delay for animation
    setTimeout(() => {
      try {
        const { playerCards, dealerCards } = BlackjackService.dealInitialCards(currentDeck);
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
        
        // Check for immediate blackjacks
        const playerValue = BlackjackService.calculateHandValue(playerCards);
        const dealerValue = BlackjackService.calculateHandValue(dealerCards);
        
        if (playerValue.isBlackjack || dealerValue.isBlackjack) {
          // Game ends immediately with blackjack(s)
          setGameStatus(GameStatus.FINISHED);
        } else {
          // Normal game - player's turn
          setGameStatus(GameStatus.PLAYER_TURN);
        }
      } catch (error) {
        console.error('Error dealing initial cards:', error);
        // Reset to betting state on error
        setGameStatus(GameStatus.BETTING);
      }
    }, 500);
  }, [currentBet, totalChips, deck, setOriginalBet, setDeck, setPlayerHand, setDealerHand, setGameStatus]);

  /**
   * Player hits (takes another card)
   */
  const handleHit = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYER_TURN) return;
    
    const card = deck.dealCard();
    if (!card) {
      console.error('No more cards in deck');
      return;
    }
    
    const newPlayerHand = [...playerHand, card];
    setPlayerHand(newPlayerHand);
    
    // Check player's new hand value
    const playerValue = BlackjackService.calculateHandValue(newPlayerHand);
    
    if (playerValue.isBust) {
      // Player busted - game ends immediately
      setGameStatus(GameStatus.FINISHED);
    } else if (playerValue.value === 21) {
      // Player has 21 - automatically stand
      setGameStatus(GameStatus.DEALER_TURN);
      
      // Play dealer's hand automatically (same logic as handleStand)
      setTimeout(() => {
        try {
          const finalDealerHand = BlackjackService.playDealerHand(deck, dealerHand);
          setDealerHand(finalDealerHand);
          setGameStatus(GameStatus.FINISHED);
        } catch (error) {
          console.error('Error playing dealer hand:', error);
          setGameStatus(GameStatus.FINISHED);
        }
      }, 1000);
    }
    // If neither bust nor 21, player continues their turn
  }, [gameStatus, deck, playerHand, dealerHand, setPlayerHand, setDealerHand, setGameStatus]);

  /**
   * Player stands (ends their turn)
   */
  const handleStand = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYER_TURN) return;
    
    // Start dealer's turn
    setGameStatus(GameStatus.DEALER_TURN);
    
    // Play dealer's hand automatically
    setTimeout(() => {
      try {
        const finalDealerHand = BlackjackService.playDealerHand(deck, dealerHand);
        setDealerHand(finalDealerHand);
        setGameStatus(GameStatus.FINISHED);
      } catch (error) {
        console.error('Error playing dealer hand:', error);
        setGameStatus(GameStatus.FINISHED);
      }
    }, 1000);
  }, [gameStatus, deck, dealerHand, setDealerHand, setGameStatus]);

  /**
   * Player doubles down (doubles bet and takes exactly one more card)
   */
  const handleDouble = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYER_TURN) return;
    if (!BlackjackService.canDoubleDown(playerHand)) return;
    
    // Check if player has enough chips to cover the doubled bet amount
    if (originalBet * 2 > totalChips) {
      console.error('Not enough chips to double down');
      return;
    }
    
    const card = deck.dealCard();
    if (!card) {
      console.error('No more cards in deck');
      return;
    }
    
    const newPlayerHand = [...playerHand, card];
    setPlayerHand(newPlayerHand);
    
    // Double the bet
    setCurrentBet(originalBet * 2);
    
    // After doubling, player automatically stands
    const playerValue = BlackjackService.calculateHandValue(newPlayerHand);
    if (playerValue.isBust) {
      setGameStatus(GameStatus.FINISHED);
    } else {
      // Start dealer's turn
      setGameStatus(GameStatus.DEALER_TURN);
      
      setTimeout(() => {
        try {
          const finalDealerHand = BlackjackService.playDealerHand(deck, dealerHand);
          setDealerHand(finalDealerHand);
          setGameStatus(GameStatus.FINISHED);
        } catch (error) {
          console.error('Error playing dealer hand:', error);
          setGameStatus(GameStatus.FINISHED);
        }
      }, 1000);
    }
  }, [gameStatus, deck, playerHand, dealerHand, originalBet, totalChips, setPlayerHand, setDealerHand, setGameStatus, setCurrentBet]);

  /**
   * Gets the current game result when game is finished
   */
  const getGameResult = useCallback(() => {
    if (gameStatus !== GameStatus.FINISHED) return null;
    
    return BlackjackService.determineGameResult(playerHand, dealerHand, currentBet);
  }, [gameStatus, playerHand, dealerHand, currentBet]);

  /**
   * Process the betting outcome when game finishes
   */
  const processBettingOutcome = useCallback(() => {
    const result = getGameResult();
    if (!result) return;

    // Update game statistics
    setGamesPlayed(gamesPlayed + 1);
    
    if (result.outcome === GameOutcome.PLAYER_WIN || 
        result.outcome === GameOutcome.PLAYER_BLACKJACK || 
        result.outcome === GameOutcome.DEALER_BUST) {
      setGamesWon(gamesWon + 1);
    }
    
    // Calculate new chip total after winnings/losses
    const newTotalChips = totalChips + (result.winAmount || 0);
    setTotalChips(newTotalChips);
    
    // Reset bet to original amount first, then adjust if needed
    setCurrentBet(originalBet);
    setOriginalBet(originalBet);
    
    // Adjust bet if player can't afford it with new chip total
    setTimeout(() => {
      adjustBetIfNeeded(newTotalChips);
    }, 100); // Small delay to ensure chip state is updated
    
    // After processing outcome, clear hands and allow betting for next game
    setTimeout(() => {
      setPlayerHand([]);
      setDealerHand([]);
      setGameStatus(GameStatus.BETTING);
    }, 2000); // Wait 2 seconds to show results before allowing new bets
    
  }, [getGameResult, gamesPlayed, gamesWon, totalChips, originalBet, adjustBetIfNeeded, setGamesPlayed, setGamesWon, setTotalChips, setCurrentBet, setOriginalBet, setPlayerHand, setDealerHand, setGameStatus]);

  /**
   * Checks if deck needs reshuffling
   */
  const needsReshuffle = useCallback(() => {
    return BlackjackService.needsReshuffle(deck);
  }, [deck]);

  // Track if we've already processed the current game's outcome
  const processedGameRef = useRef(false);

  // Process betting outcome when game finishes
  useEffect(() => {
    if (gameStatus === GameStatus.FINISHED && !processedGameRef.current) {
      processBettingOutcome();
      processedGameRef.current = true;
    } else if (gameStatus !== GameStatus.FINISHED) {
      processedGameRef.current = false;
    }
  }, [gameStatus, processBettingOutcome]);

  // Adjust bet when entering betting phase if player doesn't have enough chips
  useEffect(() => {
    if (gameStatus === GameStatus.BETTING) {
      adjustBetIfNeeded(totalChips);
    }
  }, [gameStatus, totalChips, adjustBetIfNeeded]);

  // Calculate if player can double down based on chips and game rules
  const canDoubleDown = useCallback(() => {
    return gameStatus === GameStatus.PLAYER_TURN && 
           BlackjackService.canDoubleDown(playerHand) &&
           originalBet * 2 <= totalChips;
  }, [gameStatus, playerHand, originalBet, totalChips]);

  return {
    // Game state
    gameStatus,
    playerHand,
    dealerHand,
    deck,
    
    // Betting state
    currentBet,
    totalChips,
    
    // Game actions
    startNewGame,
    handleHit,
    handleStand,
    handleDouble,
    
    // Game info
    getGameResult,
    needsReshuffle,
    processBettingOutcome,
    canDoubleDown,
    adjustBetIfNeeded,
    
    // Helper calculations
    playerValue: BlackjackService.calculateHandValue(playerHand),
    dealerValue: BlackjackService.calculateHandValue(dealerHand),
  };
};