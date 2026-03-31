# Project Rules

## Scope
- Keep changes focused on the user’s request.
- Avoid unrelated refactors.
- Prefer small, reversible edits.

## Coding Standards
- Match existing code style and naming.
- Use clear variable and function names.
- Add comments only when logic is non-obvious.

## Safety
- Do not add secrets, tokens, or private keys to source files.
- Validate input and handle expected errors.
- Prefer secure defaults in configs.

## Validation
- Run the narrowest relevant checks first (unit/lint for touched code).
- If no tests exist, do a quick manual sanity check path.
- Report any unresolved issues clearly.

## Documentation
- Update docs when behavior or setup changes.
- Keep examples minimal and runnable.
