# requirements-extraction-assistant
LLM tool that turns messy meeting transcripts into structured user stories, acceptance criteria, and action registers. Built with Node.js + Claude API.
# Requirements Extraction Assistant

A Node.js tool that converts messy meeting transcripts into structured business analysis outputs using the Claude API.

The tool generates:

* User stories
* Given/When/Then acceptance criteria
* Open questions and clarification points
* Stakeholder conflicts
* Out-of-scope items
* An actions register with owners and dependencies



## The problem

Requirements meetings rarely produce clean, complete requirements.

They often include:

* Vague statements such as “customers just need to trust the numbers again”
* Unresolved disagreements between stakeholders
* Assumptions presented as facts
* Off-topic discussions
* Unconfirmed timelines
* Actions scattered throughout the conversation

Turning this into a usable requirements pack is time-consuming and repetitive.

This project explores how an LLM can support that process while keeping the Business Analyst responsible for validating the final output.

## What the tool does

The tool:

1. Reads a meeting transcript from a text file
2. Sends the transcript to Claude with a structured system prompt
3. Applies rules covering output format, traceability, ambiguity and hallucination control
4. Returns a requirements pack containing:

   * User stories
   * Acceptance criteria
   * Items requiring clarification
   * Stakeholder conflicts
   * Out-of-scope items
   * An actions register

## Example: messy input to structured output

| Meeting input                                                | Structured output                                                                   |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| “Customers just need to trust the numbers again”             | Converted into a user story with testable acceptance criteria                       |
| Product and Compliance disagreed without reaching a decision | Recorded as an unresolved stakeholder conflict with both positions stated neutrally |
| Engineering suggested several possible causes                | Added to “Needs Clarification” rather than treated as confirmed requirements        |
| The meeting moved onto an unrelated Android login issue      | Recorded as out of scope, with the follow-up action still captured                  |
| “Two or three days, but it depends…”                         | Recorded as a provisional timeline with its dependencies                            |
| Actions were mentioned at different points in the meeting    | Consolidated into an actions register with owners, deadlines and blockers           |
| A decision was deliberately left open                        | Explicitly marked as undecided rather than completed by the model                   |

## Design decisions

### Hallucination control

The system prompt instructs the model not to invent missing details.

Anything vague, unconfirmed or undecided must be added to the **Needs Clarification** section instead of being converted into a requirement.

### Ground-truth evaluation

Before running the tool, I manually analysed the sample transcript and created an expected output.

The model-generated response was then compared with this manual analysis rather than being accepted based only on how polished it appeared.

### Iterative prompt development

The first version of the prompt did not produce an actions register.

I added a fifth output section with explicit rules covering:

* Named owners
* Provisional timelines
* Dependencies
* Blockers

The second run correctly captured all six actions from the transcript.

## What the tool got wrong

The model produced a genuine defect in one of the acceptance criteria.

One criterion instructed customers to check the transaction list. Another criterion correctly stated that the transaction list must not be referenced until Engineering had confirmed its accuracy.

These two criteria contradicted each other.

The contradiction came from different stakeholder statements in the meeting, and the model failed to recognise the conflict when generating the final output.

My manual ground-truth notes contained the correct rule, so the issue was identified during review before it could be treated as an approved requirement.

This demonstrated the main design lesson from the project:

> **The LLM drafts quickly; the analyst validates.**

Human review is not an optional final step. It is where assumptions, contradictions and incorrect interpretations are identified.

## Running the project

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Copy `.env.example` to `.env` and add your Anthropic API key.

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Add a transcript

Place the meeting transcript in:

```text
transcript.txt
```

### 4. Run the extraction

```bash
node --env-file=.env extract.js
```

## Project structure

```text
requirements-extraction-assistant/
├── extract.js
├── transcript.txt
├── .env.example
├── package.json
└── README.md
```

## Sample data

The sample transcript included in this repository is entirely fictional.

It represents a synthetic requirements meeting for an invented credit card provider and was deliberately written to include:

* Vague requirements
* Stakeholder disagreement
* Unconfirmed technical assumptions
* An unrelated meeting derailment
* Provisional timelines
* An unresolved decision

No real customer, company or confidential information is included.

## Key takeaway

This project is not intended to replace the Business Analyst.

It demonstrates how an LLM can accelerate the first draft of requirements documentation while the analyst remains responsible for:

* Validating accuracy
* Resolving ambiguity
* Checking contradictions
* Confirming stakeholder decisions
* Approving the final requirements pack
