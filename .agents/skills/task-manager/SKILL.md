---
name: task-manager
description: Guidelines for implementing and evolving task manager features consistently.
---

# Task Manager Skill

Use this skill when building or modifying task manager functionality.

## Objectives
- Keep task flows simple: create, list, update, complete, delete.
- Ensure predictable state transitions for task status.
- Preserve data integrity and avoid destructive defaults.

## Implementation Rules
1. Validate required task fields before save.
2. Use stable IDs for tasks (never index as identity).
3. Keep business logic out of UI components when possible.
4. Handle empty and error states explicitly.
5. Prefer incremental migrations for storage changes.

## Suggested Data Shape
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | done",
  "priority": "low | medium | high",
  "dueDate": "ISO-8601 or null",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

## Done Criteria
- New/changed behavior is testable.
- Core flows still work end-to-end.
- Edge cases (empty title, missing task, invalid status) are handled.
