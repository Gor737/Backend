# Two-Player Tic-Tac-Toe with Node.js

A simple two-player Tic-Tac-Toe game built with Node.js `net` module.

## Features

- Supports exactly 2 players.
- First player is assigned `X`.
- Second player is assigned `O`.
- Third connection is rejected when the server is full.
- 3×3 game board.
- Players take turns by sending cell numbers from `0` to `8`.
- Move validation:
  - Only the current player can make a move.
  - Cell must be a valid number from `0` to `8`.
  - Cell must be empty.
- Detects winners across rows, columns, and diagonals.
- Detects draws when the board is full.
- Handles player disconnection.
- Resets the game after a player leaves.
- Uses line-based TCP message framing with `\n`.

## Protocol

### Server → Client

```text
SYMBOL|X
SYMBOL|O

BOARD|_,_,_,_,_,_,_,_,_

TURN|X
TURN|O

WIN|X
WIN|O

DRAW

OPPONENT_LEFT

REJECTED|<reason>