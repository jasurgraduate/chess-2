import React, { useState, useMemo, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import Error from './error';
import { Chess } from 'chess.js';
import GameState from './gameState';
import { handleDrop } from './moves';
import { useClickHandling } from './click';
import './ChessGame.css';

const ChessGame = () => {
  const [fen, setFen] = useState(new Chess().fen()); // Initialize with the starting FEN
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0); // State to track board rotation

  const {
    game,
    onSquareClick,
    onSquareRightClick,
    onPromotionPieceSelect,
    showPromotionDialog,
    optionSquares,
    rightClickedSquares,
    moveTo
  } = useClickHandling(setFen); // Pass setFen here

  const onDrop = handleDrop(game, setFen, setError);

  // Update rotation after each move
  useEffect(() => {
    if (game) {
      setRotation(prevRotation => (prevRotation + 180) % 360); // Rotate 180 degrees
    }
  }, [fen, game]);

  // Piece components with rotation based on whose turn it is
  const customPieces = useMemo(() => {
    const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
    const pieceComponents = {};
    pieces.forEach(piece => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/chess-pro/img/${piece}.png)`,
            backgroundSize: "100%",
            transform: `rotate(${rotation}deg)`,
          }}
        />
      );
    });
    return pieceComponents;
  }, [rotation]);

  const customDarkSquareStyle = {
    backgroundColor: '#779556',
  };

  const customLightSquareStyle = {
    backgroundColor: '#ebecd0',
  };

  return (
    <div className="chessboard-container">
      <Error message={error} />
      <GameState game={game} />
      <div className="chessboard-wrapper">
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPromotionPieceSelect={onPromotionPieceSelect}
          customPieces={customPieces}
          style={{
            backgroundColor: '#f0d9b5',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: `rotate(${rotation}deg)`, // Rotate the board
            transformOrigin: 'center',
          }}
          customDarkSquareStyle={customDarkSquareStyle}
          customLightSquareStyle={customLightSquareStyle}
          customSquareStyles={{
            ...optionSquares,
            ...rightClickedSquares
          }}
          promotionToSquare={moveTo}
          showPromotionDialog={showPromotionDialog}
        />
      </div>
    </div>
  );
};

export default ChessGame;
