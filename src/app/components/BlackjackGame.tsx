'use client'

import React from 'react'
import { BlackjackContextProvider } from './context/BlackjackContext'
import { CardTable } from './ui/CardTable'
import { DealerArea } from './ui/DealerArea'
import { PlayerArea } from './ui/PlayerArea'
import { ButtonArea } from './ui/ButtonArea'
import { BettingArea } from './ui/BettingArea'
import Deck from './assets/Deck'
import { useBlackjackGame } from '../hooks/useBlackjackGame'

// Inner component that uses the game hook (needs to be inside provider)
function BlackjackGameInner() {
  const {
    deck,
    startNewGame,
    handleHit,
    handleStand,
    handleDouble,
    canDoubleDown,
  } = useBlackjackGame();

  return (
    <div className='flex items-center justify-center h-screen bg-gray-900 px-8 py-4'>

      <CardTable>
        <DealerArea className='col-start-2 row-start-1 mb-8 self-start' />
        
        {/* Button Area - Action buttons in center */}
        <ButtonArea 
          className='col-start-2 row-start-2 self-center'
          onHit={handleHit}
          onStand={handleStand}
          onDouble={handleDouble}
          onNewGame={startNewGame}
          canDoubleDown={canDoubleDown()}
        />


        {/* Deck Display - Left side */}
        <Deck 
          deck={deck} 
          className='col-start-1 row-start-1 self-center justify-self-center' 
          showCount={true}
        />

        {/* Betting Area - Right side */}
        <BettingArea className='col-start-3 row-start-2 self-center mr-4' />
        
        <PlayerArea className='col-start-2 row-start-3 mt-8 self-end' />
      </CardTable>
    </div>
  );
}

// Main component with provider
function BlackjackGame() {
  return (
    <BlackjackContextProvider>
      <BlackjackGameInner />
    </BlackjackContextProvider>
  )
}

export default BlackjackGame