# Blackjack Game

## Description

A React & Next.js based implementation of the classic casino game **Blackjack**.

## Getting Started

Follow these steps to run the blackjack game locally on your machine.

### Prerequisites

- [**Node.js**](https://nodejs.org/)
- [**npm**](https://www.npmjs.com/) (installed with Node.js)

### Installing

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikjac42/spac-week2.git
   ```

2. **Navigate to cloned repository**
   ```bash
   cd spac-week2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Executing program

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

3. **Start playing!**

## How to Play

- **Objective**: Get your card total closer to 21 than the dealer, without exceeding 21

- **Card Values**: 
   - Number cards (2-10) = Face value
   - Face cards (J, Q, K) = 10
   - Aces = 1 or 11 (automatically calculated for best hand)

- **Gameplay**:
   1. Place your bet (or go with the default bet)
   2. Click **Deal Cards**
      - You and the dealer each get 2 cards (dealer's second card is hidden)
   3. Choose between: 
      - **Hit** (take another card)
      - **Stand** (keep current total)
      - **Double** (double your bet and take exactly one more card)
    - If you go over 21, you go **Bust** and lose immediately 
   4. Once you choose to **Stand** or **Double**, the dealer will reveal their second card, and draw additional cards until they reach atleast **17** at which point the dealer will **Stand** unless they went **Bust**.
  
- **Winning**:
   - Get **Blackjack** (21 with first 2 cards) for a bonus 1.5x payout
   - Beat the dealer's total without going **Bust**
   - Dealer goes **Bust** and you don't
   - If you tie with the dealer, a **Push**, nobody wins and your  bet is returned

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── BlackjackGame.tsx      # Main game component
│   │   ├── assets/                # Generic card and deck Components
│   │   ├── context/               # State management
│   │   └── ui/                    # UI elements
│   ├── hooks/                     # Custom game logic hook
│   ├── models/                    # Data models
│   └── services/                  # Core game logic and rules
public/cards/                      # SVG card graphics
```

## Authors

- Mikkel Jacoben - [GitHub Profile](https://github.com/mikjac42)

## Version History

- **0.1** 
  - Initial Release

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Card face assets: https://code.google.com/archive/p/vector-playing-cards/ 
- Card back assets: https://commons.wikimedia.org/wiki/Category:SVG_playing_card_backs