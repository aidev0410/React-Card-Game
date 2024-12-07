import { useState, useEffect, useCallback, useMemo } from "react";

import Card from "./components/Card";
import { isPrimeNumber } from "./lib/utils";

const App = () => {
  const [n, setN] = useState(20);
  const [cards, setCards] = useState<number[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setCards(Array.from({ length: n }, (_, i) => i + 1));
  }, [n]);

  useEffect(() => {
    if (errorMessage || flippedCards.size === cards.length) return;

    let interval: number | null = null;
    if (!errorMessage) {
      interval = setInterval(() => {
        setHighlightedIndex((prev) => {
          const nextIndex = prev !== null ? prev + 1 : 0;

          // Skip already flipped cards
          if (nextIndex >= cards.length) return null;
          return nextIndex;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cards, flippedCards, errorMessage]);

  const handleCardClick = useCallback(
    (selectedNum: number) => {
      let combinations: number[] = [];
      const availableCards = cards.filter(
        (card) => !flippedCards.has(card) && card !== selectedNum
      );

      const findSubset = (index: number, total: number, subset: number[]) => {
        if (total === selectedNum && subset.length > combinations.length) {
          combinations = [...subset];
          return;
        }
        if (index >= availableCards.length || total > selectedNum) return;

        findSubset(index + 1, total + availableCards[index], [
          ...subset,
          availableCards[index],
        ]);

        findSubset(index + 1, total, subset);
      };

      findSubset(0, 0, []);

      if (combinations.length > 0) {
        setFlippedCards((prev) => new Set([...prev, ...combinations]));
        setTimeout(() => {
          setFlippedCards(
            (prev) =>
              new Set([...prev].filter((card) => !combinations.includes(card)))
          );
        }, 5000);
      } else {
        setErrorMessage("No subset found to match the selected number.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    },
    [cards, flippedCards]
  );

  const resetCards = useCallback(() => {
    setFlippedCards(new Set());
    setHighlightedIndex(null);
    setCards(Array.from({ length: n }, (_, i) => i + 1));
  }, [n]);

  const removeCard = useCallback((numberToRemove: number) => {
    setCards((prev) => prev.filter((card) => card !== numberToRemove));
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      newSet.delete(numberToRemove);
      return newSet;
    });
  }, []);

  const primeStatus = useMemo(
    () => cards.map((card) => isPrimeNumber(card)),
    [cards]
  );

  return (
    <div className="app">
      <div className="controls">
        <label>
          Enter N:
          <input
            type="number"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
        </label>
        <button onClick={resetCards}>Reset Cards</button>
      </div>
      <div className="cards-container">
        {errorMessage && <div className="error">{errorMessage}</div>}
        {cards.map((card, index) => (
          <Card
            key={card}
            number={card}
            isHighlighted={highlightedIndex === index && !primeStatus[index]}
            isFlipped={flippedCards.has(card)}
            onClick={handleCardClick}
            onRemove={removeCard}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
