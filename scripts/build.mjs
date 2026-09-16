// Build: stamp the page with commit SHA so production can always be traced back.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { formatVersion } from "../src/version.mjs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const sha = process.env.GITHUB_SHA || execSync("git rev-parse HEAD").toString().trim();
const dirty = execSync("git status --porcelain").toString().trim() !== "";
const builtBy = process.env.GITHUB_ACTIONS ? "GitHub Actions" : `${process.env.USER}@local`;
const builtAt = new Date().toISOString();
const label = formatVersion({ version: pkg.version, sha, builtAt, builtBy }) + (dirty ? " · DIRTY" : "");
const banner = process.env.BANNER || "Hello DevOps";

mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", `<!doctype html>
<meta charset="utf-8"><title>devops-demo</title>
<style>body{font:20px/1.6 system-ui;margin:3rem;color:#222}code{background:#eee;padding:.2em .4em;border-radius:4px}</style>
<h1>${banner}</h1>
<p>线上版本：<code id="v">${label}</code></p>
<p>核对方法：打开仓库 main 分支最新 commit，前 7 位应与上面一致。</p>
`);
writeFileSync("dist/version.json", JSON.stringify({ version: pkg.version, sha, builtAt, builtBy, dirty }, null, 2));
console.log("built:", label);
