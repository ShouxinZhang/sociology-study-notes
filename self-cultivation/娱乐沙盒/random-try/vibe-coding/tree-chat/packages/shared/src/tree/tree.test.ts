import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addNode, editUser, emptyForest, forkFrom, makeNode, pathTo, pathTranscript } from "./index.ts";

describe("forest path", () => {
  it("keeps only the current branch in the transcript", () => {
    let forest = emptyForest();
    const userA = makeNode("user", null, { text: "A" });
    forest = addNode(forest, userA);
    const modelA = makeNode("model", userA.id, { answer: "ans-A" });
    forest = addNode(forest, modelA);

    forest = forkFrom(forest, userA.id);
    const userB = makeNode("user", forest.currentId, { text: "B" });
    forest = addNode(forest, userB);
    const modelB = makeNode("model", userB.id, { answer: "ans-B" });
    forest = addNode(forest, modelB);

    assert.deepEqual(
      pathTo(forest, modelA.id).map((n) => n.id),
      [userA.id, modelA.id],
    );
    assert.deepEqual(pathTranscript(forest).map((m) => m.text), ["B", "ans-B"]);
    assert.equal(forest.nodes[userA.id]?.children.length, 1);
    assert.equal(forest.roots.length, 2);
  });

  it("edits a user node with children as a sibling fork", () => {
    let forest = emptyForest();
    const user = makeNode("user", null, { text: "old" });
    forest = addNode(forest, user);
    forest = addNode(forest, makeNode("model", user.id, { answer: "x" }));
    forest = editUser(forest, user.id, "new");

    assert.equal(forest.roots.length, 2);
    assert.equal(forest.nodes[user.id]?.text, "old");
    assert.equal(forest.nodes[forest.currentId ?? ""]?.text, "new");
  });
});
