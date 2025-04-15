'use client'
import React, { useState, useEffect, useRef } from 'react';
import Row from './Row';

interface GridProps {
  word: string;
}

function Grid({ word }: GridProps) {
  const ROWS = 6;
  const numOfLettersInRow = 5;

  const [currentRow, setCurrentRow] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]); 

  function createRows() {
    let grid = [];
    for (let i = 0; i < ROWS; i++) {
      let isEnabled = currentRow === i;
      grid.push(
        <Row
          key={i}
          rowIndex={i}
          isEnabled={isEnabled}
          checkWord={checkWord}
          setHighlight={setHighlight}
          rowRefs={(el) => rowRefs.current[i] = el}
        />
      );
    }
    return grid;
  }

  async function isValidWord(word: string) {

    if (word.length !== numOfLettersInRow) {
      return false;
    }
    const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  }

  // Typing event and wordArr arguments in checkWord
  async function checkWord (
    e: React.KeyboardEvent,
    wordArr: string[],
    setLetters: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<(HTMLInputElement | null)[]>
  ) {
    if (e.key === "Enter") { // Using strict equality (===)
      e.preventDefault();
      let wordStr = wordArr.join(''); // More concise way to join the word

      if (await isValidWord(wordStr)) {

        if (wordStr === word) { // Strict equality check
          alert('You won');
        } else if (currentRow === ROWS - 1) { // Strict equality check
          alert(`You lose, the word is ${word}`);
        }

        if (currentRow < ROWS - 1) {
          setCurrentRow(currentRow + 1);
          rowRefs.current[currentRow + 1]?.focus()
        }
        setGuesses([...guesses, wordStr]);
    } else {
      alert('Invalid word!');
      setLetters(Array(5).fill(''));
      refs.current[0]?.focus();
    }
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
