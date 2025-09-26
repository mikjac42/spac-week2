import React from 'react';

export interface CardTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
  * CardTable component provides the main table layout for the blackjack game
  */
export function CardTable({ children, className }: CardTableProps) {
  return (
    <div className={`table ${className}`}>
      {children}
      <style jsx>{`
        .table {
          width: 100%;
          height: 100%;
          min-width: 1000px;
          min-height: 800px;
          max-width: 1200px;
          background: radial-gradient(ellipse at center, #2d7a2d, #1a5a1a);
          border: 8px solid #8b4513;
          border-radius: 200px;
          box-shadow: 
            inset 0 0 50px rgba(0, 0, 0, 0.3),
            0 10px 30px rgba(0, 0, 0, 0.4);
          display: grid;
          grid-template-columns: 200px 1fr 200px;
          grid-template-rows: 1fr 100px 1fr;
          }
      `}</style>
    </div>
  );
}
