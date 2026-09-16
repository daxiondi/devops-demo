import { test } from "node:test";
import assert from "node:assert/strict";
import { formatVersion, isDeployable } from "../src/version.mjs";

test("version string contains short sha", () => {
  const s = formatVersion({ version: "1.0.0", sha: "abcdef1234567", builtAt: "t", builtBy: "ci" });
  assert.ok(s.includes("abcdef1"));
});

test("build without sha is rejected", () => {
  assert.throws(() => formatVersion({ version: "1.0.0", sha: "", builtAt: "t", builtBy: "ci" }));
});

test("only clean main is deployable", () => {
  assert.equal(isDeployable({ branch: "main", dirty: false }), true);
  assert.equal(isDeployable({ branch: "main", dirty: true }), false);
  assert.equal(isDeployable({ branch: "feature/x", dirty: false }), false);
});
