## ADDED Requirements

### Requirement: Export history as JSON
The system SHALL write the full history array as formatted JSON to stdout when the user runs the export command. The output SHALL be valid JSON suitable for piping to other tools.

#### Scenario: Export with entries
- **WHEN** the user runs `snap export` and the history contains entries
- **THEN** the full history array is written to stdout as pretty-printed JSON

#### Scenario: Export empty history
- **WHEN** the user runs `snap export` and the history is empty
- **THEN** an empty JSON array `[]` is written to stdout
