import React from 'react';
import { Deck as DeckModel } from '../../models/deck';
import Image from 'next/image';

interface DeckProps {
  deck: DeckModel;
  className?: string;
  onClick?: () => void;
  showCount?: boolean;
}

/**
 * Deck component for visualizing a deck of cards
 * Shows a stack of face-down cards with remaining card count
 */
const Deck: React.FC<DeckProps> = ({ 
  deck, 
  className = '',
  onClick,
  showCount = true
}) => {
  const remainingCards = deck.getRemainingNumberOfCards();
  const totalCards = deck.getNumberOfCardsTotal();
  const isEmpty = remainingCards === 0;

  // Calculate stack height based on remaining cards (visual effect)
  const stackLayers = Math.min(Math.ceil(remainingCards / 10), 8); // Max 8 visible layers

  // Base classes for styling
  const baseClasses = `
    relative
    inline-block
    transition-all
    duration-300
    ease-in-out
    ${onClick ? 'cursor-pointer hover:scale-105' : ''}
    ${isEmpty ? 'opacity-50' : ''}
    ${className}`;

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={`${remainingCards} cards remaining`}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Card Stack */}
      <div className="relative w-28 h-40">
        {/* Create multiple card layers for stack effect */}
        {!isEmpty && Array.from({ length: stackLayers }, (_, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              zIndex: stackLayers - index,
              transform: `translate(${index * 1}px, ${index * 1}px)`,
              filter: index > 0 ? 'brightness(0.9)' : 'none',
            }}
          >
            <Image
              src="/cards/card_back.svg"
              alt="Card deck"
              width={112}
              height={160}
              className="w-28 h-40 rounded-lg shadow-lg"
              style={{
                filter: `brightness(${1 - index * 0.1})`,
              }}
            />
          </div>
        ))}

        {/* Empty deck placeholder */}
        {isEmpty && (
          <div className="w-28 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-100">
            <span className="text-gray-500 text-xs font-medium">Empty</span>
          </div>
        )}
      </div>

      {/* Card Count Display */}
      {showCount && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="text-white px-2 py-1 rounded text-sm font-medium whitespace-nowrap">
            {remainingCards}/{totalCards}
          </div>
        </div>
      )}

      {/* Reshuffle Indicator */}
      {remainingCards > 0 && remainingCards < totalCards * 0.25 && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shuffle {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
          100% { transform: translateY(0px); }
        }
        
        .deck:hover .card-stack {
          animation: shuffle 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Deck;
