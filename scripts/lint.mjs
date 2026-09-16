// Minimal lint: reject console.log left in src/ and files without trailing newline.
import { readdirSync, readFileSync } from "node:fs";
let bad = 0;
for (const f of readdirSync("src")) {
  const s = readFileSync(`src/${f}`, "utf8");
  if (/console\.log/.test(s)) { console.error(`lint: console.log in src/${f}`); bad++; }
  if (!s.endsWith("\n")) { console.error(`lint: missing trailing newline in src/${f}`); bad++; }
}
process.exit(bad ? 1 : 0);
