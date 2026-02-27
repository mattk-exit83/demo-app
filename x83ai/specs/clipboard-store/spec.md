# clipboard-store Specification

## Purpose
TBD - created by archiving change snap. Update Purpose after archive.
## Requirements
### Requirement: Save clipboard content
The system SHALL read the current clipboard content and persist it as a new entry in the history store at `~/.snap/history.json`. Each entry SHALL have an auto-incrementing integer `id`, the clipboard `content` as a string, and a `timestamp` in ISO 8601 format.

#### Scenario: Save new entry to empty history
- **WHEN** the history file is empty or does not exist
- **THEN** the system creates the file and stores the entry with `id: 1`

#### Scenario: Save new entry to existing history
- **WHEN** the history contains entries with max id 5
- **THEN** the new entry is appended with `id: 6`

#### Scenario: Empty clipboard
- **WHEN** the clipboard is empty
- **THEN** the system prints an error message and does not save

### Requirement: List history entries
The system SHALL display all saved entries in reverse chronological order (newest first), showing the `id`, a truncated preview of `content` (first 80 characters), and a relative timestamp.

#### Scenario: List with entries
- **WHEN** the history contains 3 entries
- **THEN** all 3 entries are displayed newest-first with id, preview, and timestamp

#### Scenario: List with empty history
- **WHEN** the history is empty
- **THEN** the system prints a message indicating no entries saved

### Requirement: Search history entries
The system SHALL filter entries by case-insensitive substring match against entry `content` and display matching entries in reverse chronological order.

#### Scenario: Search with matches
- **WHEN** the user searches for "url" and two entries contain "url" in their content
- **THEN** both matching entries are displayed

#### Scenario: Search with no matches
- **WHEN** the user searches for "xyz" and no entries contain "xyz"
- **THEN** the system prints a message indicating no matches found

### Requirement: Get entry by ID
The system SHALL copy the content of a specific entry (identified by `id`) back to the system clipboard.

#### Scenario: Get existing entry
- **WHEN** the user requests entry with id 3 and it exists
- **THEN** the entry's content is copied to the clipboard and a confirmation message is displayed

#### Scenario: Get non-existent entry
- **WHEN** the user requests entry with id 99 and it does not exist
- **THEN** the system prints an error message

### Requirement: History size cap
The system SHALL maintain a maximum of 50 entries. When saving a new entry would exceed this limit, the oldest entry (lowest id) SHALL be removed before the new entry is added.

#### Scenario: Cap enforcement
- **WHEN** the history contains 50 entries and a new entry is saved
- **THEN** the oldest entry is removed and the new entry is appended, resulting in 50 entries total

### Requirement: Auto-create storage directory
The system SHALL create the `~/.snap/` directory and `history.json` file automatically on first use if they do not exist.

#### Scenario: First run
- **WHEN** `~/.snap/` does not exist and the user runs any command
- **THEN** the directory and an empty history file are created before the operation proceeds

