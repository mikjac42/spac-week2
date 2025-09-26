import React from 'react';
import { Card as CardModel } from '../../models/card';
import Image from 'next/image';

interface CardProps {
  card?: CardModel;
  showBack?: boolean;
  className?: string;
  onClick?: () => void;
  alt?: string;
}

/**
 * Card component for visualizing a playing card
 * Can show either the face or back of the card
 */
const Card: React.FC<CardProps> = ({ 
  card, 
  showBack = false, 
  className = '',
  onClick,
  alt 
}) => {
  // Determine the image source
  const getImageSrc = (): string => {
    if (showBack || !card) {
      return '/cards/card_back.svg';
    }
    return `/cards/${card.getRank()}_of_${card.getSuit()}.svg`;
  };

  // Generate alt text
  const getAltText = (): string => {
    if (alt) return alt;
    if (showBack || !card) return 'Card back';
    return `${card.getRank()} of ${card.getSuit()}`;
  };

  // Base classes for styling
  const baseClasses = `
    relative
    inline-block
    transition-transform
    duration-200
    ease-in-out
    hover:scale-105
    rounded-lg
    overflow-hidden
    w-28
    h-40
    ${className}`;

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Image
        src={getImageSrc()}
        alt={getAltText()}
        width={112}
        height={160}
        className="w-28 h-40 object-fill"
        priority={false}
      />
    </div>
  );
};

export default Card;
