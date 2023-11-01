# Airtable API Full Backuper

Backs up the record data (json), table schemas (json) and attachments. Does not back up interfaces and automations.

This application performs a full backup of Airtable bases using the Airtable API.

## Features

    Backup all bases for a given Airtable account
    Save each base to a separate folder with JSON file per table
    Logs progress, errors, and statistics


## Set up

1. Go to [https://airtable.com/create/tokens/new](https://airtable.com/create/tokens/new)
2. Create an API token with Access "All current and future bases in all current and future workspaces" and the scopes:
    * `data.records:read`
    * `schema.bases:read`
3. Rename a `.env.example` to `.env` file in the base directory
4. Paste your token and backup dir name into `.env` file after `=`

## Usage

    Clone the repo
    Set the following environment variables:

    AIRTABLE_ACCESS_TOKEN - your Airtable API token
    BACKUP_DIR - you backup dir name

    Run: npm start

Backups will be saved to the backups folder. Once it is done, you can zip and upload your backup to wherever you would like to keep it.