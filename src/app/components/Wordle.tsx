'use client'
import React, { useState, useEffect } from 'react';
import Grid from './Grid';

function Wordle() {
  const API_URL = 'https://api.datamuse.com/words?sp=?????';
  const [word, setWord] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const validWords = data.filter(w => w.word.length === 5 && /^[a-zA-Z]+$/.test(w.word));
        const randomWord = validWords[Math.floor(Math.random() * validWords.length)];
        setWord(randomWord.word.toUpperCase());
      })
      .catch(console.error);
  }, []);

  if (!word) return <div>Loading word...</div>;

  return (
    <div>
      <Grid word={word} />
    </div>
  );
}

export default Wordle;
