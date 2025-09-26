import React from 'react';
import { useBlackjack } from '../context/BlackjackContext';
import { BlackjackService } from '../../services/blackjackService';
import Card from '../assets/Card';

interface PlayerAreaProps {
  className?: string;
}

/**
 * PlayerArea component displays the player's cards and hand value
 */
export const PlayerArea: React.FC<PlayerAreaProps> = ({
  className = ''
}) => {
  const { playerHand } = useBlackjack();

  // Calculate player hand value
  const playerValue = BlackjackService.calculateHandValue(playerHand);

  return (
    <div className={`player-area ${className}`}>

      {/* Hand Value Display */}
      <div className="text-center text-lg mb-2 font-semibold">
        {(playerHand.length > 0) && (
          <span className={`
            ${playerValue.isBust ? 'text-red-400' : 
              playerValue.isBlackjack ? 'text-yellow-400' : 
              'text-green-400'}
          `}>
            {BlackjackService.formatHandValue(playerValue)}
          </span>
        )}
      </div>

      {/* Player Cards */}
      <div className="cards-container">
        <div className="flex justify-center items-center">
          {playerHand.map((card, index) => {
            // Calculate dynamic spacing based on number of cards
            const baseOffset = Math.min(12, Math.max(4, 20 - playerHand.length * 2)); // Reduce spacing as cards increase
            const xOffset = index * -baseOffset;
            
            return (
              <div
                key={`player-card-${index}`}
                className="card-wrapper"
                style={{
                  transform: `translateX(${xOffset}px) rotate(${(index - playerHand.length / 2) * 1.5}deg)`,
                  zIndex: index
                }}
              >
                <Card
                  card={card}
                />
              </div>
            );
          })}
        </div>

        {/* Empty state when no cards */}
        {playerHand.length === 0 && (
          <div className="flex justify-center gap-2">
            <div className="w-28 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center" />
            <div className="w-28 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center" />
          </div>
        )}
      </div>

      {/* Player Label */}
      <div className="text-center mt-2">
        <h2 className="text-xl font-bold text-white">Player</h2>
      </div>

      <style jsx>{`
        .player-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          min-height: 300px;
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
          .player-area {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};