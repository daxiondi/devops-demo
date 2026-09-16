// Returns a human-readable version string for the page.
export function formatVersion({ version, sha, builtAt, builtBy }) {
  if (!sha) throw new Error("sha is required: a build without a commit SHA is untraceable");
  return `v${version} · ${sha.slice(0, 7)} · ${builtAt} · by ${builtBy}`;
}

// Deployment must come from main and must not be a dirty tree.
export function isDeployable({ branch, dirty }) {
  return branch === "main" && !dirty;
}
