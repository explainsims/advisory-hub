import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ICEBREAKER_QUESTIONS } from '../data/icebreakers';

export default function Flipbook() {
  const [currentQuestion, setCurrentQuestion] = useState("Click below for a fun icebreaker! 👇");
  const [isFlipping, setIsFlipping] = useState(false);
  const [key, setKey] = useState(0);

  const handleRandom = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    
    let flips = 0;
    const maxFlips = 8;
    
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
      setCurrentQuestion(ICEBREAKER_QUESTIONS[Math.floor(Math.random() * ICEBREAKER_QUESTIONS.length)]);
      flips++;
      
      if (flips >= maxFlips) {
        clearInterval(interval);
        setIsFlipping(false);
      }
    }, 120);
    
  }, [isFlipping]);

  // Generate spiral rings
  const rings = Array.from({ length: 12 }).map((_, i) => (
    <div key={i} className="flex flex-col items-center justify-center -mt-4 z-20">
      <div className="w-2.5 h-6 bg-gradient-to-b from-gray-300 via-gray-100 to-gray-400 rounded-full border border-gray-400 shadow-sm shadow-black/20" />
      <div className="w-2.5 h-2.5 rounded-full bg-slate-800 -mt-1 z-10" />
    </div>
  ));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Notebook Container */}
      <div className="relative w-80 h-48 md:w-96 md:h-56 bg-amber-50 rounded-md shadow-xl border border-amber-200/50 flex flex-col perspective-1000">
        
        {/* Spiral Binding Header */}
        <div className="absolute top-0 left-0 w-full h-8 flex justify-evenly items-start px-2">
           {rings}
        </div>

        {/* Paper Container */}
        <div className="relative w-full h-full pt-6 px-8 pb-4 flex items-center justify-center overflow-hidden">
          {/* Lined paper effect */}
          <div className="absolute inset-0 pt-8" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #94a3b833 27px, #94a3b833 28px)' }}></div>
          
          <AnimatePresence>
            <motion.div
              key={key}
              initial={{ rotateX: -90, opacity: 0, transformOrigin: 'top' }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0, position: 'absolute' }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="text-center relative z-10 w-full"
            >
              <p 
                className="text-2xl md:text-3xl text-slate-800 font-bold leading-tight"
                style={{ fontFamily: "'Caveat', cursive", transform: 'rotate(-1deg)' }}
              >
                {currentQuestion}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Stack of pages effect */}
        <div className="absolute -bottom-1 -right-1 w-full h-full bg-amber-50 rounded-md border border-amber-200/50 -z-10"></div>
        <div className="absolute -bottom-2 -right-2 w-full h-full bg-amber-100/50 rounded-md border border-amber-200/50 -z-20"></div>
      </div>

      <button 
        onClick={handleRandom}
        disabled={isFlipping}
        className="px-6 py-2.5 bg-[#0635aa] hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        {isFlipping ? 'Flipping...' : 'Find a Random Question'}
      </button>
    </div>
  );
}
