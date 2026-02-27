## MODIFIED Requirements

### Requirement: Save clipboard content
The system SHALL read the current clipboard content and persist it as a new entry in the history store at `~/.snap/history.json`. Each entry SHALL have an auto-incrementing integer `id`, the clipboard `content` as a string, a `timestamp` in ISO 8601 format, and an optional `tags` array of strings. When tags are provided, they SHALL be stored with the entry. When no tags are provided, the `tags` field SHALL be omitted.

#### Scenario: Save new entry to empty history
- **WHEN** the history file is empty or does not exist
- **THEN** the system creates the file and stores the entry with `id: 1`

#### Scenario: Save new entry to existing history
- **WHEN** the history contains entries with max id 5
- **THEN** the new entry is appended with `id: 6`

#### Scenario: Empty clipboard
- **WHEN** the clipboard is empty
- **THEN** the system prints an error message and does not save

#### Scenario: Save with tags
- **WHEN** the user provides one or more tags during save
- **THEN** the entry is stored with a `tags` array containing the provided tag strings

#### Scenario: Save without tags
- **WHEN** the user does not provide any tags during save
- **THEN** the entry is stored without a `tags` field

### Requirement: List history entries
The system SHALL display all saved entries in reverse chronological order (newest first), showing the `id`, a truncated preview of `content` (first 80 characters), a relative timestamp, and any tags. When a tag filter is provided, only entries with a matching tag SHALL be displayed.

#### Scenario: List with entries
- **WHEN** the history contains 3 entries
- **THEN** all 3 entries are displayed newest-first with id, preview, and timestamp

#### Scenario: List with empty history
- **WHEN** the history is empty
- **THEN** the system prints a message indicating no entries saved

#### Scenario: List with tag filter
- **WHEN** the user provides a tag filter and entries with that tag exist
- **THEN** only entries matching the tag are displayed

#### Scenario: List with tag filter no matches
- **WHEN** the user provides a tag filter and no entries have that tag
- **THEN** the system prints a message indicating no entries found with that tag
