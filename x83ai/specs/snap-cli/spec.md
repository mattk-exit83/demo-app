# snap-cli Specification

## Purpose
TBD - created by archiving change snap. Update Purpose after archive.
## Requirements
### Requirement: Default command saves clipboard
The system SHALL treat invocation with no arguments (`snap`) as the save command, reading the current clipboard and storing it.

#### Scenario: No arguments
- **WHEN** the user runs `snap` with no arguments
- **THEN** the current clipboard content is saved to history

### Requirement: List command
The system SHALL accept `snap list` to display all saved clipboard entries.

#### Scenario: List subcommand
- **WHEN** the user runs `snap list`
- **THEN** all history entries are displayed in reverse chronological order

### Requirement: Search command
The system SHALL accept `snap search <query>` to find entries matching the query.

#### Scenario: Search with query
- **WHEN** the user runs `snap search "example"`
- **THEN** entries containing "example" are displayed

#### Scenario: Search without query
- **WHEN** the user runs `snap search` with no query argument
- **THEN** the system prints a usage error indicating a query is required

### Requirement: Get command
The system SHALL accept `snap get <id>` to copy a saved entry back to the clipboard.

#### Scenario: Get with valid id
- **WHEN** the user runs `snap get 3`
- **THEN** entry 3's content is copied to the clipboard

#### Scenario: Get without id
- **WHEN** the user runs `snap get` with no id argument
- **THEN** the system prints a usage error indicating an id is required

### Requirement: Help output
The system SHALL display usage information when invoked with `snap help` or `snap --help`. The help text SHALL include all commands: save (default), list, search, get, clear, stats, export, and the `--tag` flag.

#### Scenario: Help flag
- **WHEN** the user runs `snap --help`
- **THEN** usage information listing all commands is displayed

#### Scenario: Help subcommand
- **WHEN** the user runs `snap help`
- **THEN** usage information listing all commands is displayed

### Requirement: Unknown command handling
The system SHALL print an error message and usage hint when an unrecognized command is provided.

#### Scenario: Unknown subcommand
- **WHEN** the user runs `snap foo`
- **THEN** the system prints "Unknown command: foo" and shows usage information

### Requirement: Clear command
The system SHALL accept `snap clear` to clear all history entries after confirmation.

#### Scenario: Clear subcommand
- **WHEN** the user runs `snap clear`
- **THEN** the system prompts for confirmation and proceeds accordingly

### Requirement: Stats command
The system SHALL accept `snap stats` to display history usage statistics.

#### Scenario: Stats subcommand
- **WHEN** the user runs `snap stats`
- **THEN** history statistics are displayed

### Requirement: Export command
The system SHALL accept `snap export` to write the full history as JSON to stdout.

#### Scenario: Export subcommand
- **WHEN** the user runs `snap export`
- **THEN** the history is written to stdout as JSON

### Requirement: Tag flag for save
The system SHALL accept `snap --tag <name>` to tag an entry during save. Multiple `--tag` flags SHALL be supported to apply multiple tags.

#### Scenario: Save with single tag
- **WHEN** the user runs `snap --tag work`
- **THEN** the clipboard content is saved with the tag "work"

#### Scenario: Save with multiple tags
- **WHEN** the user runs `snap --tag work --tag url`
- **THEN** the clipboard content is saved with tags ["work", "url"]

### Requirement: Tag flag for list
The system SHALL accept `snap list --tag <name>` to filter the list by a specific tag.

#### Scenario: List filtered by tag
- **WHEN** the user runs `snap list --tag work`
- **THEN** only entries tagged with "work" are displayed

