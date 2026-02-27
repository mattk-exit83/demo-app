## ADDED Requirements

### Requirement: Clear history
The system SHALL delete all entries from the history store after receiving user confirmation. The system SHALL prompt the user with "Clear all history? (y/N)" and only proceed if the user enters "y" or "Y". Any other input (including empty) SHALL abort the operation.

#### Scenario: Clear with confirmation
- **WHEN** the user runs `snap clear` and enters "y" at the prompt
- **THEN** the history file is truncated to an empty array and a confirmation message is displayed

#### Scenario: Clear aborted
- **WHEN** the user runs `snap clear` and enters anything other than "y"/"Y"
- **THEN** the history is not modified and an abort message is displayed

#### Scenario: Clear empty history
- **WHEN** the user runs `snap clear` and the history is already empty
- **THEN** the system prints a message indicating there is nothing to clear

### Requirement: Show stats
The system SHALL display a summary of history usage including: total entry count, oldest entry timestamp, newest entry timestamp, and history file size in bytes.

#### Scenario: Stats with entries
- **WHEN** the user runs `snap stats` and the history contains entries
- **THEN** the system displays count, oldest timestamp, newest timestamp, and file size

#### Scenario: Stats with empty history
- **WHEN** the user runs `snap stats` and the history is empty
- **THEN** the system displays count as 0 and indicates no entries saved
