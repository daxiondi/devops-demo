// Send a Feishu custom-bot card. Usage: node scripts/notify-feishu.mjs <status> <title> <text>
// Requires FEISHU_WEBHOOK (and optional FEISHU_SECRET for signed bots).
import { createHmac } from "node:crypto";

const [status = "info", title = "devops-demo", text = ""] = process.argv.slice(2);
const url = process.env.FEISHU_WEBHOOK;
if (!url) { console.log("FEISHU_WEBHOOK not set, skip notify"); process.exit(0); }

const color = { success: "green", failure: "red", info: "blue" }[status] || "blue";
const body = {
  msg_type: "interactive",
  card: {
    header: { title: { tag: "plain_text", content: title }, template: color },
    elements: [{ tag: "markdown", content: text }],
  },
};
if (process.env.FEISHU_SECRET) {
  const ts = Math.floor(Date.now() / 1000).toString();
  body.timestamp = ts;
  body.sign = createHmac("sha256", `${ts}\n${process.env.FEISHU_SECRET}`).update("").digest("base64");
}
const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const j = await r.json();
console.log("feishu:", JSON.stringify(j));
if (j.code && j.code !== 0) process.exit(1);
