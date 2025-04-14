'use client'
import React, { useState, useEffect, useRef } from 'react';
import Row from './Row';

interface GridProps {
  word: string;  // Define the type for the word prop
}

function Grid({ word }: GridProps) {
  const ROWS = 6;
  const numOfLettersInRow = 5;

  const [currentRow, setCurrentRow] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]); // Typing guesses as an array of strings
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);  // Typing the ref array

  function createRows() {
    let grid = [];
    for (let i = 0; i < ROWS; i++) {
      let isEnabled = currentRow === i; // Using strict equality (===)
      grid.push(
        <Row
          key={i}
          rowIndex={i}
          isEnabled={isEnabled}
          checkWord={checkWord}
          setHighlight={setHighlight}
          rowRefs={rowRefs}
        />
      );
    }
    return grid;
  }

  // Typing event and wordArr arguments in checkWord
  function checkWord(e: React.KeyboardEvent, wordArr: string[]) {
    if (e.key === "Enter") { // Using strict equality (===)
      e.preventDefault();
      let wordStr = wordArr.join(''); // More concise way to join the word

      if (wordStr === word) { // Strict equality check
        alert('You won');
      } else if (currentRow === ROWS - 1) { // Strict equality check
        alert(`You lose, the word is ${word}`);
      }

      if (currentRow < ROWS - 1) {
        setCurrentRow(currentRow + 1);
        rowRefs.current[currentRow + 1]?.focus();
      }
      setGuesses([...guesses, wordStr]);
    }
  }

  // Typing word and row, i parameters in setHighlight
  function setHighlight(row: number, i: number) {
    if (guesses[row] && guesses[row][i]) {
      let char = guesses[row][i];
      if (char === word[i]) { // Strict equality check
        return "inplace";
      } else if (word.includes(char)) {
        return "contains";
      }
    }
    return '';
  }

  return (
    <div>
      {createRows()}
    </div>
  );
}

export default Grid;
