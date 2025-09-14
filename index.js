import { query } from "@anthropic-ai/claude-code";

const response = query({
  prompt: "Hi",
  options: {
    model: "claude-3-5-haiku-20241022",
  },
});

for await (const message of response) {
  if (message.type === "system" && message.subtype === "init") {
    console.log(`Session started with ID: ${message.session_id}`);
  }

  console.log(message);
}
