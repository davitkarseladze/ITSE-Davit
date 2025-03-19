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
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
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
