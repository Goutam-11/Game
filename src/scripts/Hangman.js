import React, { useState, useEffect, useCallback } from 'react';
import HangmanImage0 from './images/hangman-0.svg';
import HangmanImage1 from './images/hangman-1.svg';
import HangmanImage2 from './images/hangman-2.svg';
import HangmanImage3 from './images/hangman-3.svg';
import HangmanImage4 from './images/hangman-4.svg';
import HangmanImage5 from './images/hangman-5.svg';
import HangmanImage6 from './images/hangman-6.svg';
import LostGif from './images/lost.gif';
import WinGif from './images/victory.gif';  // Import win GIF
import wordList from './word-list';

const Hangman = () => {
  // State variables
  const [word, setWord] = useState('');
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [maxIncorrectGuesses] = useState(6);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [hint, setHint] = useState('');
  const [isWin, setIsWin] = useState(false); // New state for win condition

  // Hangman images
  const hangmanImages = [
    HangmanImage0,
    HangmanImage1,
    HangmanImage2,
    HangmanImage3,
    HangmanImage4,
    HangmanImage5,
    HangmanImage6,
  ];

  // Fetch random word and hint from wordList.js
  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  };

  // Start the game
  const startGame = useCallback(() => {
    const { word: randomWord, hint } = getRandomWord();
    setWord(randomWord.toLowerCase());
    setHint(hint);
    setCorrectGuesses([]);
    setIncorrectGuesses(0);
    setGameOver(false);
    setGameOverMessage('');
    setIsWin(false); // Reset win state
  }, []);

  // Display word on screen
  const displayWord = () => {
    const wordArray = word.split('');
    return wordArray.map((letter, index) => (
      <li key={index} className="letter">
        {correctGuesses.includes(letter) ? letter : ''}
      </li>
    ));
  };

  // Handle keyboard button click
  const handleKeyboardClick = (letter) => {
    if (gameOver) return;

    if (word.includes(letter)) {
      setCorrectGuesses((prevCorrectGuesses) => [...prevCorrectGuesses, letter]);
    } else {
      setIncorrectGuesses((prevIncorrectGuesses) => prevIncorrectGuesses + 1);
    }
  };

  // Check if the user has won
  const checkWin = useCallback(() => {
    const wordGuessed = word.split('').every((letter) => correctGuesses.includes(letter));
    if (wordGuessed) {
      setGameOver(true);
      setIsWin(true); // Set win state
      setGameOverMessage('Congratulations, you won!');
    }
  }, [correctGuesses, word]);

  // Check if the user has lost
  const checkLoss = useCallback(() => {
    if (incorrectGuesses >= maxIncorrectGuesses) {
      setGameOver(true);
      setGameOverMessage(`Game Over! The correct word was: ${word}`);
    }
  }, [incorrectGuesses, maxIncorrectGuesses, word]);

  // Generate keyboard buttons
  const generateKeyboard = () => {
    const keyboardButtons = [];
    for (let i = 97; i <= 122; i++) {
      const letter = String.fromCharCode(i);
      keyboardButtons.push(
        <button
          key={letter}
          onClick={() => handleKeyboardClick(letter)}
          disabled={gameOver || correctGuesses.includes(letter) || incorrectGuesses >= maxIncorrectGuesses}
        >
          {letter}
        </button>
      );
    }
    return keyboardButtons;
  };

  // Initialize the game
  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (!gameOver) {
      checkWin();
      checkLoss();
    }
  }, [checkWin, checkLoss, correctGuesses, incorrectGuesses, gameOver]);

  // Determine the current hangman image
  const hangmanImage = hangmanImages[incorrectGuesses];

  return (
    <div className="hangman-container">
      {gameOver && (
        <div className="game-modal visible">
          <div className="content">
            <img src={isWin ? WinGif : LostGif} alt="gif" /> {/* Show win or loss GIF */}
            <h4>{gameOver ? (isWin ? 'Congratulations!' : 'Game Over!') : ''}</h4>
            <p>{gameOverMessage}</p>
            <button className="play-again" onClick={startGame}>Play Again</button>
          </div>
        </div>
      )}
      <div className="hangman-box">
        <img src={hangmanImage} alt="hangman-img" />
        <h1>Hangman Game</h1>
      </div>
      <div className="game-box">
        <ul className="word-display">
          {displayWord()}
        </ul>
        <h4 className="hint-text">
          Hint: <b>{hint}</b>
        </h4>
        <h4 className="guesses-text">
          Incorrect guesses: <b>{incorrectGuesses} / {maxIncorrectGuesses}</b>
        </h4>
        <div className="keyboard">
          {generateKeyboard()}
        </div>
      </div>
    </div>
  );
};

export default Hangman;
