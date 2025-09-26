import React from 'react';
import { useBlackjack } from '../context/BlackjackContext';
import { GameStatus } from '../context/BlackjackContext';
import { BlackjackService } from '../../services/blackjackService';
import Card from '../assets/Card';

interface DealerAreaProps {
  className?: string;
}

/**
 * DealerArea component displays the dealer's cards and hand value
 */
export const DealerArea: React.FC<DealerAreaProps> = ({ className = '' }) => {
  const { dealerHand, gameStatus } = useBlackjack();

  // Determine if we should hide the dealer's hole card (second card)
  const shouldHideHoleCard = gameStatus === GameStatus.PLAYER_TURN || 
                            gameStatus === GameStatus.BETTING ||
                            gameStatus === GameStatus.DEALING;

  // Calculate dealer hand value
  const dealerValue = BlackjackService.calculateHandValue(dealerHand);
  
  // For display purposes when hole card is hidden, calculate with only the up card
  const displayValue = shouldHideHoleCard && dealerHand.length > 0
    ? BlackjackService.calculateHandValue([dealerHand[0]]) // Show only up card value
    : dealerValue;

  return (
    <div className={`dealer-area ${className}`}>
      {/* Dealer Label */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-white">Dealer</h2>
      </div>

      {/* Dealer Cards */}
      <div className="cards-container">
        <div className="flex justify-center items-center">
          {dealerHand.map((card, index) => {
            // Calculate dynamic spacing based on number of cards
            const baseOffset = Math.min(12, Math.max(4, 20 - dealerHand.length * 2)); // Reduce spacing as cards increase
            const xOffset = index * -baseOffset;
            
            return (
              <div
                key={`dealer-card-${index}`}
                className="card-wrapper"
                style={{
                  transform: `translateX(${xOffset}px) rotate(${(index - dealerHand.length / 2) * -1.5}deg)`,
                  zIndex: index
                }}
              >
                <Card
                  card={card}
                  showBack={index === 1 && shouldHideHoleCard} // Hide hole card (second card) when appropriate
                  alt={index === 1 && shouldHideHoleCard ? 'Hidden dealer card' : undefined}
                />
              </div>
            );
          })}
        </div>

        {/* Empty state when no cards */}
        {dealerHand.length === 0 && (
          <div className="flex justify-center gap-2">
            <div className="w-28 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center" />
            <div className="w-28 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center" />
          </div>
        )}
      </div>

      {/* Hand Value Display */}
        <div className="text-lg font-semibold text-gray-200">
          {(dealerHand.length > 0) && (
            <span>
              {shouldHideHoleCard && dealerHand.length > 1
                ? `${displayValue.value} + ?` // Show up card value + hidden card
                : BlackjackService.formatHandValue(displayValue)
              }
            </span>
          )}
        </div>

      {/* Game Status Messages for Dealer */}
      {gameStatus === GameStatus.DEALER_TURN && (
        <div className="text-center mt-4">
          <p className="text-yellow-400 font-semibold animate-pulse">
            Dealer's Turn
          </p>
        </div>
      )}

      {gameStatus === GameStatus.FINISHED && dealerValue.isBust && (
        <div className="text-center mt-4">
          <p className="text-red-400 font-semibold text-lg">
            Dealer Bust!
          </p>
        </div>
      )}

      {gameStatus === GameStatus.FINISHED && dealerValue.isBlackjack && (
        <div className="text-center mt-4">
          <p className="text-purple-400 font-semibold text-lg">
            Dealer Blackjack!
          </p>
        </div>
      )}

      <style jsx>{`
        .dealer-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 200px;
        }

        .cards-container {
          position: relative;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .card-wrapper {
          transition: transform 0.3s ease-in-out;
        }

        .card-wrapper:hover {
          transform: translateX(0) translateY(-5px) rotate(0deg) !important;
          z-index: 100 !important;
        }

        @media (max-width: 640px) {
          .dealer-area {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};