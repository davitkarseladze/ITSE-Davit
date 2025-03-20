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
import { expect } from "chai";

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
 * Testing strategy for practice():
 *
 * partitions for bucket:
 * bucket is empty
 * bucket is single set
 * bucket is multiple
 * 
 * partition for days:
 * day = 0
 * day = 2*n - 1
 * day > 0
 * 
 */
describe("practice()", () => {
  it("should return an empty set if there are no flashcards", () => {
    const buckets: Array<Set<Flashcard>> = [];
    expect(practice(buckets, 0)).to.deep.equal(new Set());
    expect(practice(buckets, 3)).to.deep.equal(new Set());
    expect(practice(buckets, 1)).to.deep.equal(new Set());
    expect(practice(buckets, 30)).to.deep.equal(new Set());
    
    assert.deepStrictEqual(practice(buckets, 0), new Set());
  });
    
  it("when we have one set in bucket", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const card3 = new Flashcard("Q3", "A3", "Hint3", []);

    const zeroBucketList = new Set([card1, card2, card3]);
    const buckets: Array<Set<Flashcard>> = [
      new Set([card1, card2, card3]), // Bucket 0 (review daily)
    ];

    expect(practice(buckets, 0)).to.deep.equal(zeroBucketList);
    expect(practice(buckets, 3)).to.deep.equal(zeroBucketList);
    expect(practice(buckets, 23)).to.deep.equal(zeroBucketList);

    assert.deepStrictEqual(practice(buckets, 5), new Set([card1, card2]));
  });

  it.only("where we have multiple set in bucket", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const card3 = new Flashcard("Q3", "A3", "Hint3", []);
    const card4 = new Flashcard("Q4", "A4", "Hint4", []);
    const card5 = new Flashcard("Q5", "A5", "Hint5", []);
    const card6 = new Flashcard("Q6", "A6", "Hint6", []);

    const zeroBucketList = new Set([card1, card2, card3]);

    const thirdBucketList = new Set([card4, card5]);    

    const buckets: Array<Set<Flashcard>> = [
      zeroBucketList,
      new Set(),
      thirdBucketList,
      new Set(),
      new Set([card6])
    ];

    assert.deepStrictEqual(practice(buckets, 4), new Set([card1])); // 4 % (2^1) == 0
    assert.deepStrictEqual(practice(buckets, 5), new Set()); // 5 % (2^1) != 0
  });

  it("should return flashcards from higher buckets based on their review schedule", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const card3 = new Flashcard("Q3", "A3", "Hint3", []);

    const buckets: Array<Set<Flashcard>> = [
      new Set(), // Bucket 0
      new Set(), // Bucket 1
      new Set([card1]), // Bucket 2 (review every 4 days)
      new Set([card2, card3]) // Bucket 3 (review every 8 days)
    ];

    assert.deepStrictEqual(practice(buckets, 4), new Set([card1])); // 4 % 4 == 0

    assert.deepStrictEqual(practice(buckets, 10), new Set()); // 10 % 4 != 0, 10 % 8 != 0
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
  it("should return the predefined hint if available", () => {
    const card = new Flashcard("What is 2+2?", "4", "Think of pairs", []);
    assert.strictEqual(getHint(card), "Think of pairs");
  });

  it("should generate a hint by hiding some characters if no predefined hint exists", () => {
    const card = new Flashcard("Elephant", "A large mammal", "", []);
    assert.strictEqual(getHint(card), "E******t");
  });

  it("should handle single-letter words correctly", () => {
    const card = new Flashcard("A", "First letter of the alphabet", "", []);
    assert.strictEqual(getHint(card), "A"); 
  });

  it("should handle short words with only 2 or 3 letters", () => {
    const card = new Flashcard("Cat", "A small pet", "", []);
    assert.strictEqual(getHint(card), "C*t");
  });

  it("should return a default message if the front text is empty", () => {
    const card = new Flashcard("", "Answer", "", []);
    assert.strictEqual(getHint(card), "No hint available");
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
