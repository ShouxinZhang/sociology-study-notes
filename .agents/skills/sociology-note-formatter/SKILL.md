---
name: sociology-note-formatter
description: A skill to format draft sociology notes, categorize them, and ensure consistency with the repository's structure.
---

# Sociology Note Formatter Skill

This skill helps the user transform raw thoughts and draft notes into structured Markdown files suitable for the `sociology-study-notes` repository.

## Capabilities

- **Categorization**: Determine if a note belongs in `notes/Methodology_Academic_Strategy/` or `notes/Philosophy_Life_Reflection/`.
- **Formatting**: Convert raw text into clean Markdown with headers, bullet points, and proper spacing.
- **Reference Analysis**: Suggest internal links to existing notes.

## Guidelines

1. **Hierarchy**: Use Markdown headers (e.g., `#`, `##`) to create a clear information hierarchy.
2. **Metadata**: Each note should start with a title header.
3. **Draft Processing**: When processing files from `draft-notes/`, always ask which target category is most appropriate.
4. **Consistency**: Follow the existing style found in the `notes/` directory.

## Examples

### Input (Raw text)
"Study habits are important for sociology students. We need to focus on deep work."

### Output (Formatted result)
Category: `notes/Methodology_Academic_Strategy/Productivity_Strategy.md`
Content:
# Study Habits in Sociology
Emphasis on deep work for complex sociological analysis...
