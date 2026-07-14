const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");

const client = new Anthropic();

// Read the meeting transcript from the file
const transcript = fs.readFileSync("transcript.txt", "utf8");

// System prompt: the permanent instructions that define the tool's job
const SYSTEM_PROMPT = `
You are a requirements analyst assistant supporting a Business Analyst
in a regulated financial services environment.

When given a meeting transcript, produce:

1. USER STORIES - in the format "As a [role], I want [capability],
   so that [benefit]". Each story must include acceptance criteria
   written as Given / When / Then.

2. NEEDS CLARIFICATION - a list of anything vague, ambiguous, or
   left undecided in the meeting. Never invent details to fill a gap;
   flag them here instead.

3. STAKEHOLDER CONFLICTS - any points where attendees disagreed,
   stating each position neutrally without picking a winner.

4. OUT OF SCOPE ITEMS RAISED - one line per off-topic item mentioned.

5. ACTIONS AND CONSTRAINTS - a list of agreed actions, each with a
   named owner, plus any stated timelines, deadlines, or dependencies.
   Mark timelines as provisional if the meeting treated them that way.

Rules:
- Only extract what was actually said in the transcript.
- Do not add requirements that were not discussed.
- If a requirement depends on something unconfirmed, say so explicitly.
- Use the exact names and roles of attendees when assigning actions.
`;

async function main() {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: "Extract the requirements from this meeting transcript:\n\n" + transcript
      }
    ]
  });
  console.log(response.content[0].text);
}

main();