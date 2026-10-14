/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_ADVICE_LIST, AdviceItem } from './data/advice';

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'advice'>('home');

  // Deck of unseen advice items so an advice is never shown again once viewed
  const [deck, setDeck] = useState<AdviceItem[]>(() => {
    return shuffleArray(INITIAL_ADVICE_LIST);
  });

  const [currentAdvice, setCurrentAdvice] = useState<AdviceItem | null>(() => {
    return INITIAL_ADVICE_LIST[0] || null;
  });

  // Track key for triggering the slow fade-in transition
  const [fadeKey, setFadeKey] = useState<number>(0);

  const getNextAdvice = useCallback(() => {
    setDeck((prevDeck) => {
      let activeDeck = prevDeck;

      // If all 215+ advices have been seen, replenish and shuffle
      if (activeDeck.length === 0) {
        activeDeck = shuffleArray(INITIAL_ADVICE_LIST);
      }

      const nextItem = activeDeck[0];
      const remainingDeck = activeDeck.slice(1);

      setCurrentAdvice(nextItem);
      setFadeKey((prev) => prev + 1);

      return remainingDeck;
    });
  }, []);

  const goToAdvicePage = () => {
    getNextAdvice();
    setCurrentPage('advice');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 text-center selection:bg-black selection:text-white relative overflow-hidden">
      {currentPage === 'home' ? (
        /* HOME PAGE */
        <div className="max-w-4xl w-full flex flex-col items-center justify-center py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
            This website is not cool. This is useless.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-black font-normal leading-relaxed max-w-2xl">
            Yes, you have heard right, this website is completely useless.{' '}
            <button
              onClick={goToAdvicePage}
              className="underline cursor-pointer hover:opacity-60 transition-opacity font-medium inline"
            >
              Click here to get some useful advice.
            </button>
          </p>
        </div>
      ) : (
        /* ADVICE PAGE */
        <>
          {/* Centered Advice & Action */}
          <div className="max-w-4xl w-full flex flex-col items-center justify-center py-12 min-h-[300px]">
            {/* Smooth slow fade-in animation for useless advice */}
            <AnimatePresence mode="wait">
              {currentAdvice && (
                <motion.blockquote
                  key={fadeKey}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-black max-w-3xl leading-snug mb-10 select-text"
                >
                  "{currentAdvice.advice}"
                </motion.blockquote>
              )}
            </AnimatePresence>

            {/* Bottom prompt: Motivated? click here for more advice. */}
            <p className="text-sm sm:text-base text-black font-normal">
              Motivated?{' '}
              <button
                onClick={getNextAdvice}
                className="underline cursor-pointer hover:opacity-60 transition-opacity font-normal inline"
              >
                click here for more advice.
              </button>
            </p>
          </div>

          {/* Footer at the absolute very bottom edge of the advice screen */}
          <footer className="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center px-4 pointer-events-none">
            <p className="text-xs sm:text-sm text-black/80 font-normal">
              Sorry, because all of the uselessness of this website affect the advices.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
