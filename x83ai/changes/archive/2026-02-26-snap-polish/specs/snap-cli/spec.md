## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Help output
The system SHALL display usage information when invoked with `snap help` or `snap --help`. The help text SHALL include all commands: save (default), list, search, get, clear, stats, export, and the `--tag` flag.

#### Scenario: Help flag
- **WHEN** the user runs `snap --help`
- **THEN** usage information listing all commands is displayed

#### Scenario: Help subcommand
- **WHEN** the user runs `snap help`
- **THEN** usage information listing all commands is displayed
