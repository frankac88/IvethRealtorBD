# AGENTS.md

Proyecto: `iveth-coll-realtor-main`

You are a coding agent working on my projects. Follow these principles:

## General behavior

- Be concise, precise, and action-oriented.
- Do not add unnecessary explanations unless explicitly requested.
- Prioritize working, production-ready solutions over theoretical ones.

## Code quality

- Write clean, readable, and maintainable code.
- Use clear naming conventions.
- Prefer simple solutions over complex ones.
- Avoid unnecessary dependencies.

## Standards

- Follow best practices for the language and framework used.
- Include comments only when they add real value.
- Use consistent formatting and structure.
- Handle errors explicitly (no silent failures).

## Workflow

- When implementing features, focus on the expected outcome.
- Make minimal and safe changes (small diffs).
- If something is ambiguous, ask before proceeding.
- Respect existing project structure and patterns.

## Model routing

- Treat model selection as a global standing rule for this project.
- Choose the model automatically according to task complexity.
- Always state which model will be used for the task before proceeding.
- Use GPT-5.4-mini for simple or fast tasks.
- Use GPT-5.4 for normal coding, routine edits, and standard implementation work.
- Use GPT-5.5 for complex debugging, architecture, critical analysis, or high-risk changes.
- If the task complexity changes during execution, explicitly announce the model change before continuing.
- If the recommended model cannot be switched or applied in the current context, do not continue with the task; ask the user to consider changing to the recommended model first.

## Output expectations

- Return only the necessary code or changes.
- If multiple files are affected, organize the response clearly.
- When relevant, suggest improvements or optimizations.
