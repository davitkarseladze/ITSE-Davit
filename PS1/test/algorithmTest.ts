import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
  it("returns an EMPTY array when BucketMap is EMPTY", () => {
    const buckets : BucketMap = new Map();
    const result = toBucketSets(buckets);
    assert.deepStrictEqual(result, []); 
  });
   
  it("returns a single element correctly", () => {
    const card1 : Flashcard = new Flashcard("A1","B1","C1",[]);
    const card2 : Flashcard = new Flashcard("A2","B2","C2",[]);
    const buckets : BucketMap = new Map([[0,new Set([card1,card2])]]);
    const result = toBucketSets(buckets);
    assert.deepStrictEqual(result,[new Set([card1,card2])]);
});

  it("fills missing indexes with empty sets", () => {
    const card1 : Flashcard = new Flashcard("A1","B1","C1",[]);
    const card2 : Flashcard = new Flashcard("A2","B2","C2",[]);
    const buckets : BucketMap = new Map([
      [0,new Set([card1])],
      [3,new Set([card2])]
    ]);

    const result = toBucketSets(buckets);
    assert.deepStrictEqual(result,[
      new Set([card1]), 
      new Set(),
      new Set(),
      new Set([card2])])
 });
  
 
 it("includes empty sets when buckets have no flashcards", () => {
  const buckets: BucketMap = new Map([
    [0, new Set()],
    [1, new Set()],
    [2, new Set()],
  ]);
  const result = toBucketSets(buckets);
  assert.deepStrictEqual(result, [new Set(), new Set(), new Set()]);
});
});

/*
 * Testing strategy for getBucketRange():
 *
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("returns undefined when all buckets are empty", () => {
    const bucket: Set<Flashcard>[] = [new Set(), new Set(), new Set()];
    const result = getBucketRange(bucket);
    assert.strictEqual(result, undefined);
  });

  it("returns { minBucket: 1, maxBucket: 3 } when flashcards are in non-consecutive buckets", () => {
    const bucket: Set<Flashcard>[] = [
      new Set(), 
      new Set([new Flashcard("A1", "B1", "C1", [])]), 
      new Set(), 
      new Set([new Flashcard("A2", "B2", "C2", [])]), 
      new Set()
    ];
    const result = getBucketRange(bucket);
    assert.deepStrictEqual(result, { minBucket: 1, maxBucket: 3 });
  });

  it("returns { minBucket: 1, maxBucket: 1 } when only one bucket contains flashcards", () => {
    const bucket: Set<Flashcard>[] = [
      new Set(), 
      new Set([new Flashcard("A1", "B1", "C1", [])]), 
      new Set()
    ];
    const result = getBucketRange(bucket);
    assert.deepStrictEqual(result, { minBucket: 1, maxBucket: 1 });
  });

  it("returns { minBucket: 0, maxBucket: 0 } when only the first bucket contains flashcards", () => {
    const bucket: Set<Flashcard>[] = [
      new Set([new Flashcard("A1", "B1", "C1", [])]), 
      new Set(), 
      new Set()
    ];
    const result = getBucketRange(bucket);
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 0 });
  });

  it("returns { minBucket: 0, maxBucket: 4 } when flashcards are in all buckets", () => {
    const bucket: Set<Flashcard>[] = [
      new Set([new Flashcard("A1", "B1", "C1", [])]),
      new Set([new Flashcard("A2", "B2", "C2", [])]),
      new Set([new Flashcard("A3", "B3", "C3", [])]),
      new Set([new Flashcard("A4", "B4", "C4", [])]),
      new Set([new Flashcard("A5", "B5", "C5", [])]),
    ];
    const result = getBucketRange(bucket);
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 4 });
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("should move the flashcard to bucket 0 if answered incorrectly", () => {
    const card = new Flashcard("Q1", "A1", "Hint1", []);
    const buckets: BucketMap = new Map();
    buckets.set(2, new Set([card])); 

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Wrong);

    assert.strictEqual(updatedBuckets.get(2)?.has(card), false); 
    assert.strictEqual(updatedBuckets.get(0)?.has(card), true); 
  });

  it("should move the flashcard to the next bucket if answered hard", () => {
    const card = new Flashcard("Q2", "A2", "Hint2", []);
    const buckets: BucketMap = new Map();
    buckets.set(1, new Set([card])); 

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Hard);

    assert.strictEqual(updatedBuckets.get(1)?.has(card), false); 
    assert.strictEqual(updatedBuckets.get(2)?.has(card), true); 
  });

  it("should move the flashcard two buckets forward if answered easy", () => {
    const card = new Flashcard("Q3", "A3", "Hint3", []);
    const buckets: BucketMap = new Map();
    buckets.set(1, new Set([card])); 

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Easy);

    assert.strictEqual(updatedBuckets.get(1)?.has(card), false); 
    assert.strictEqual(updatedBuckets.get(3)?.has(card), true); 
  });

  it("should not move beyond the last bucket if answered hard", () => {
    const card = new Flashcard("Q4", "A4", "Hint4", []);
    const buckets: BucketMap = new Map();
    buckets.set(4, new Set([card])); 

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Hard);

    assert.strictEqual(updatedBuckets.get(4)?.has(card), true); 
  });

  it("should not move beyond the last bucket if answered easy", () => {
    const card = new Flashcard("Q5", "A5", "Hint5", []);
    const buckets: BucketMap = new Map();
    buckets.set(4, new Set([card])); 

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Easy);

    assert.strictEqual(updatedBuckets.get(4)?.has(card), true); 
  });

  it("should correctly handle an empty bucket scenario", () => {
    const card = new Flashcard("Q6", "A6", "Hint6", []);
    const buckets: BucketMap = new Map();

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Hard);

    assert.strictEqual(updatedBuckets.get(0)?.has(card), true); 
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
