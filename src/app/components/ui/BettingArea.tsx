import React from 'react';
import { useBlackjack } from '../context/BlackjackContext';
import { GameStatus } from '../context/BlackjackContext';
import { ActionButton } from './ActionButton';

export interface BettingAreaProps {
  className?: string;
}

/**
 * BettingArea component displays current chips, bet amount, and betting controls
 */
export function BettingArea({ className }: BettingAreaProps) {
  const {
    totalChips,
    currentBet,
    gameStatus,
    gamesPlayed,
    gamesWon,
    setCurrentBet,
    setOriginalBet,
  } = useBlackjack();

  // Betting amounts available
  const betAmounts = [5, 10, 25, 50, 100, 500];

  // Calculate win percentage
  const winPercentage = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  // Can only bet during betting phase
  const canBet = gameStatus === GameStatus.BETTING;

  const handleBetChange = (amount: number) => {
    if (!canBet || amount > totalChips) return;
    setCurrentBet(amount);
    setOriginalBet(amount);
  };

  return (
    <div className={`betting-area ${className}`}>
      {/* Total Chips Display */}
      <div className="chip-display">
        <div className="chip-info">
          <div className="total-chips">{totalChips}</div>
          <div className="chips-label">Total Chips</div>
        </div>
      </div>

      {/* Current Bet Display */}
      <div className="bet-display">
        <div className="current-bet">{currentBet}</div>
        <div className="bet-label">Current Bet</div>
      </div>

      {/* Betting Controls */}
      <div className="betting-controls">
        <div className="bet-buttons">
          {betAmounts.map((amount) => (
            <ActionButton
              key={amount}
              onClick={() => handleBetChange(amount)}
              disabled={!canBet || amount > totalChips}
              variant={currentBet === amount ? 'primary' : 'secondary'}
              size="small"
            >
              {amount}
            </ActionButton>
          ))}
        </div>
      </div>

      {/* Game Statistics */}
      <div className="game-stats">
        <div className="stat">
          <span className="stat-value">{gamesWon} / {gamesPlayed}</span>
          <span className="stat-label">Hands won</span>
        </div>
        <div className="stat">
          <span className="stat-value">{winPercentage}%</span>
          <span className="stat-label">Win Rate</span>
        </div>
      </div>

      <style jsx>{`
        .betting-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          backdrop-filter: blur(5px);
          border: 2px solid rgba(255, 215, 0, 0.3);
          min-width: 180px;
        }

        .chip-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .chip-stack {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .chip {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .chip-red {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          top: 0;
          left: 0;
          z-index: 3;
        }

        .chip-blue {
          background: linear-gradient(45deg, #2563eb, #3b82f6);
          top: 3px;
          left: 3px;
          z-index: 2;
        }

        .chip-green {
          background: linear-gradient(45deg, #16a34a, #22c55e);
          top: 6px;
          left: 6px;
          z-index: 1;
        }

        .chip-info {
          text-align: center;
        }

        .total-chips {
          font-size: 20px;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
        }

        .chips-label {
          font-size: 12px;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bet-display {
          text-align: center;
          padding: 15px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(255, 215, 0, 0.3);
          width: 100%;
        }

        .current-bet {
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
        }

        .bet-label {
          font-size: 12px;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 5px;
        }

        .betting-controls {
          width: 100%;
        }

        .bet-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 100%;
        }

        .game-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-value {
          font-weight: bold;
          color: #fff;
        }

        .stat-label {
          font-size: 12px;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}
