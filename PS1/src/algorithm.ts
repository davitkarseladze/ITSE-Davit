/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {

  const maxBucket = Math.max(...Array.from(buckets.keys()));
  
  const result: Array<Set<Flashcard>> = new Array(maxBucket + 1).fill(null).map(() => new Set<Flashcard>());
  
  buckets.forEach((flashcards, bucketNumber) => {
    result[bucketNumber] = flashcards;

  });

  return result;
}


/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  let minBucket: number | undefined = undefined;
  let maxBucket: number | undefined = undefined;

  buckets.forEach((cards, bucketIndex) => {
    if (cards.size > 0) {
      if (minBucket === undefined) minBucket = bucketIndex; 
      maxBucket = bucketIndex; 
    }
    });

  return minBucket !== undefined && maxBucket !== undefined
    ? { minBucket, maxBucket }
    : undefined;
}




/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const reviewSet = new Set<Flashcard>();

  buckets.forEach((cards, bucketIndex) => {
    if (day % (2 ** bucketIndex) === 0) {
      cards.forEach(card => reviewSet.add(card));
    }
  });
  

  return reviewSet;
}


/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const updatedBuckets = new Map(buckets); 
  let currentBucket: number | undefined = undefined;

 
  for (const [bucketIndex, cards] of updatedBuckets.entries()) {
    if (cards.has(card)) {
      currentBucket = bucketIndex;
      cards.delete(card); 
      break;
    }
  }

  
  if (currentBucket === undefined) {
    currentBucket = 0;
  }

 
  let newBucket: number;
  if (difficulty === AnswerDifficulty.Wrong) {
    newBucket = 0;
  } else if (difficulty === AnswerDifficulty.Hard) {
    newBucket = Math.min(currentBucket + 1, 4); 
  } else { 
    newBucket = Math.min(currentBucket + 2, 4); 
  }

  
  if (!updatedBuckets.has(newBucket)) {
    updatedBuckets.set(newBucket, new Set());
  }
  updatedBuckets.get(newBucket)!.add(card);

  return updatedBuckets;
}



/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {

  if (card.hint.trim().length > 0) {
    return card.hint;
  }


  if (card.front.trim().length === 0) {
    return "No hint available";
  }

 
  if (card.front.length <= 2) {
    return card.front;
  }

  const firstLetter = card.front[0];
  const lastLetter = card.front[card.front.length - 1];
  const maskedMiddle = "*".repeat(card.front.length - 2);

  return `${firstLetter}${maskedMiddle}${lastLetter}`;

}

/**
 * Figures out how well the user is doing with their flashcards.
 *
 * @param buckets A map where:
 *        - The keys are bucket numbers (starting from 0).
 *        - The values are sets of flashcards in each bucket.
 * @param history A list of past practice attempts.
 *        Each entry in the list has:
 *        - day: The day the user practiced.
 *        - card: The flashcard that was practiced.
 *        - difficulty: How well the user did (Wrong, Hard, or Easy).
 * @returns An object with stats about the user's progress:
 *          - totalCards: How many flashcards exist in total.
 *          - bucketDistribution: Shows how many cards are in each bucket.
 *          - averageBucket: The average bucket number (higher = better progress).
 *          - practiceHistory: Tracks how many flashcards were practiced each day.
 *          - accuracyRate: Percentage of correct answers (Hard or Easy) out of all attempts.
 * @spec.requires buckets is a valid map of flashcard buckets.
 * @spec.requires history is a valid list of past practice attempts (not empty).
 */
export function computeProgress(
  buckets: BucketMap,
  history: { day: number; card: Flashcard; difficulty: AnswerDifficulty }[]
): {
  totalCards: number;
  bucketDistribution: { [key: number]: number };
  averageBucket: number;
  practiceHistory: { [key: number]: number };
  accuracyRate: number;
} {
  let totalCards = 0;
  let bucketDistribution: { [key: number]: number } = {};
  let totalBucketSum = 0;
  let totalAttempts = 0;
  let correctAttempts = 0;
  let practiceHistory: { [key: number]: number } = {};

  buckets.forEach((cards, bucketNumber) => {
    const count = cards.size;
    totalCards += count;
    bucketDistribution[bucketNumber] = count;
    totalBucketSum += bucketNumber * count;
  });

  const averageBucket = totalCards > 0 ? totalBucketSum / totalCards : 0;

  history.forEach(({ day, difficulty }) => {
    practiceHistory[day] = (practiceHistory[day] || 0) + 1;
    totalAttempts++;
    if (difficulty === AnswerDifficulty.Hard || difficulty === AnswerDifficulty.Easy) {
      correctAttempts++;
    }
  });

  const accuracyRate = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

  return {
    totalCards,
    bucketDistribution,
    averageBucket,
    practiceHistory,
    accuracyRate,
  };
}