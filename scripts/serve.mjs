import { createServer } from "node:http";
import { readFileSync } from "node:fs";
createServer((req, res) => {
  const f = req.url === "/version.json" ? "dist/version.json" : "dist/index.html";
  res.end(readFileSync(f));
}).listen(8080, () => console.log("http://localhost:8080"));
