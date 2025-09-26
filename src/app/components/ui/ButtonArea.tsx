import React from 'react';
import { useBlackjack } from '../context/BlackjackContext';
import { GameStatus } from '../context/BlackjackContext';
import { BlackjackService } from '../../services/blackjackService';
import { ActionButton } from './ActionButton';

interface ButtonAreaProps {
  className?: string;
  onHit?: () => void;
  onStand?: () => void;
  onDouble?: () => void;
  onNewGame?: () => void;
  canDoubleDown?: boolean;
}

/**
 * ButtonArea component displays the action buttons for the player
 */
export const ButtonArea: React.FC<ButtonAreaProps> = ({
  className = '',
  onHit,
  onStand,
  onDouble,
  onNewGame,
  canDoubleDown: canDoubleDownProp
}) => {
  const { playerHand, gameStatus, totalChips, currentBet } = useBlackjack();

  // Calculate player hand value
  const playerValue = BlackjackService.calculateHandValue(playerHand);

  // Determine available actions based on game state and hand
  const canHit = gameStatus === GameStatus.PLAYER_TURN && 
                 BlackjackService.canPlayerHit(playerHand) && 
                 !playerValue.isBust;

  const canStand = gameStatus === GameStatus.PLAYER_TURN && !playerValue.isBust;

  const canDouble = canDoubleDownProp !== undefined ? canDoubleDownProp : 
                    (gameStatus === GameStatus.PLAYER_TURN && 
                     BlackjackService.canDoubleDown(playerHand) && 
                     !playerValue.isBust);

  const canStartNewGame = gameStatus === GameStatus.BETTING;
  const hasEnoughChips = currentBet <= totalChips;

  return (
    <div className={`button-area ${className}`}>
      {/* Action Buttons */}
      <div className="actions-container">
        {/* Game Actions */}
        {(gameStatus === GameStatus.PLAYER_TURN) && (
          <div className="flex flex-wrap justify-center gap-3">

            {/* Hit Button */}
            <ActionButton
              onClick={onHit || (() => {})}
              disabled={!canHit || !onHit}
              variant="primary"
              title="Take another card"
            >
              Hit
            </ActionButton>

            {/* Stand Button */}
            <ActionButton
              onClick={onStand || (() => {})}
              disabled={!canStand || !onStand}
              variant="secondary"
              title="Keep current hand and end turn"
            >
              Stand
            </ActionButton>

            {/* Double Down Button */}
            {canDouble && (
              <ActionButton
                onClick={onDouble || (() => {})}
                disabled={!canDouble || !onDouble}
                variant="success"
                title="Double your bet and take exactly one more card"
              >
                Double
              </ActionButton>
            )}
          </div>
        )}

        {/* Deal Cards Button - Only during betting phase */}
        {canStartNewGame && (
          <div className="flex justify-center">
            <ActionButton
              onClick={onNewGame || (() => {})}
              disabled={!onNewGame || !hasEnoughChips}
              variant="primary"
              size="large"
              title={!hasEnoughChips ? "Not enough chips for current bet" : "Start a new hand"}
            >
              {hasEnoughChips ? "Deal Cards" : "Insufficient Chips"}
            </ActionButton>
          </div>
        )}

        {/* Game Status Messages */}
        {gameStatus === GameStatus.DEALING && (
          <div className="text-center">
            <p className="text-blue-400 font-semibold animate-pulse">
              Dealing cards...
            </p>
          </div>
        )}

        {gameStatus === GameStatus.DEALER_TURN && (
          <div className="text-center">
            <p className="text-yellow-400 font-semibold">
              Dealer is playing...
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .button-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          min-height: 100px;
          max-height: 100px;
          justify-content: center;
          overflow: hidden;
        }

        .actions-container {
          width: 100%;
          max-width: 500px;
        }

        @media (max-width: 640px) {
          .button-area {
            padding: 0.5rem;
          }
          
          .actions-container {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};