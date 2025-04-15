'use client'
import React, { useState, useRef, useEffect } from 'react';

interface RowProps {
  rowIndex: number;
  isEnabled: boolean;
  checkWord: (e: React.KeyboardEvent, wordArr: string[]) => void;
  setHighlight: (row: number, i: number) => string;
  rowRef: (el: HTMLInputElement | null) => void; // Type the rowRef properly
}

function Row({ rowIndex, isEnabled, checkWord, setHighlight, rowRef }: RowProps) {
  const numOfLettersInRow = 5;
  const [letters, setLetters] = useState<string[]>(Array(5).fill('')); // Type state as string[]
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Type the refs

  // Handle letter change in input fields
  function handleLetterChange(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const val = e.target.value.toUpperCase();
    if (!/^[A-Z]?$/.test(val)) return; // Only allow alphabetic characters

    // Move focus to next input if there's a valid character
    if (val && i < numOfLettersInRow - 1) {
      inputRefs.current[i + 1]?.focus();
    }

    // Update the letters state
    const copy = [...letters];
    copy[i] = val;
    setLetters(copy);
  }

  // Handle backspace key
  function handleBackSpace(e: React.KeyboardEvent, i: number) {
    if (e.key === "Backspace" && i > 0 && !letters[i]) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  // Create row of input elements
  function createRow() {
    const row = [];
    for (let i = 0; i < numOfLettersInRow; i++) {
      row.push(
        <input
          type="text"
          ref={(el) => {
            inputRefs.current[i] = el;
            if (i === 0 && rowRef) rowRef(el); // Set ref for first input
          }}
          key={rowIndex * numOfLettersInRow + i}
          value={letters[i] || ''}
          onKeyUp={(e) => checkWord(e, letters , setLetters, inputRefs)}
          onKeyDown={(e) => handleBackSpace(e, i)}
          maxLength={1}
          onChange={(e) => handleLetterChange(e, i)}
          className={`tile ${setHighlight(rowIndex, i)}`}
          disabled={!isEnabled}
        />
      );
    }
    return row;
  }

  useEffect(() => {
    if (isEnabled && inputRefs.current[0]) {
      inputRefs.current[0]?.focus(); // Programmatically focus the first input of the row
    }
  }, [isEnabled]);

  return <div className="row">{createRow()}</div>;
}

export default Row;
