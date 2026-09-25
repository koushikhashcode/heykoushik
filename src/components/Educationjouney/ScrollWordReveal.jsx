import React, { Fragment, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

const START_OPACITY = 0.2;
const SPREAD = 0.82;
const WORD_DURATION = 0.2;

export function getWordProgressRange(index, count) {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;
  return {
    start,
    end: Math.min(1, start + WORD_DURATION),
  };
}

export function getWordOpacity(progress, { start, end }, startOpacity = START_OPACITY) {
  if (progress <= start) return startOpacity;
  if (progress >= end) return 1;
  const wordProgress = (progress - start) / (end - start);
  return startOpacity + (1 - startOpacity) * wordProgress;
}

export const ScrollWord = ({
  children,
  progress,
  index,
  count,
  reducedMotion,
  startOpacity = START_OPACITY,
  isGold = false,
  className = '',
}) => {
  const range = getWordProgressRange(index, count);
  const opacity = useTransform(progress, (latest) =>
    getWordOpacity(latest, range, startOpacity),
  );

  return (
    <motion.span
      aria-hidden="true"
      className={`inline-word-span ${isGold ? 'text-gold' : ''} ${className}`}
      style={reducedMotion ? undefined : { opacity }}
    >
      {children}
    </motion.span>
  );
};

/**
 * Self-contained text component that progressively illuminates each word as it is scrolled into view.
 */
export function ScrollWordRevealParagraph({
  text,
  className = '',
  as: Component = 'p',
  startOpacity = START_OPACITY,
  offset = ['start 95%', 'center 45%'],
  goldWords = [],
  id,
}) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const words = text.split(' ');
  const goldSet = new Set(goldWords.map((w) => w.toLowerCase()));

  return (
    <Component
      ref={containerRef}
      className={className}
      id={id}
      aria-label={text}
    >
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isGold = goldSet.has(cleanWord);
        return (
          <Fragment key={`${word}-${index}`}>
            <ScrollWord
              progress={scrollYProgress}
              index={index}
              count={words.length}
              reducedMotion={Boolean(reducedMotion)}
              startOpacity={startOpacity}
              isGold={isGold}
            >
              {word}
            </ScrollWord>
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        );
      })}
    </Component>
  );
}

/**
 * Reveal letters or words for display headlines
 */
export function ScrollDisplayWordReveal({
  text,
  className = '',
  as: Component = 'h1',
  startOpacity = 0.25,
  offset = ['start start', 'end 25%'],
  byLetter = false,
  id,
}) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const units = byLetter ? text.split('') : text.split(' ');

  return (
    <Component
      ref={containerRef}
      className={className}
      id={id}
      aria-label={text}
    >
      {units.map((unit, index) => (
        <ScrollWord
          key={`${unit}-${index}`}
          progress={scrollYProgress}
          index={index}
          count={units.length}
          reducedMotion={Boolean(reducedMotion)}
          startOpacity={startOpacity}
          className="inline-word-span"
        >
          {unit === ' ' ? '\u00A0' : unit}
        </ScrollWord>
      ))}
    </Component>
  );
}

/**
 * Block wrapper to orchestrate scroll reveal across multiple elements
 */
export function ScrollRevealGroup({
  children,
  className = '',
  offset = ['start 90%', 'center 40%'],
  id,
}) {
  const groupRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: groupRef,
    offset,
  });

  return (
    <div ref={groupRef} className={className} id={id}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          scrollYProgress,
          reducedMotion: Boolean(reducedMotion),
        });
      })}
    </div>
  );
}
