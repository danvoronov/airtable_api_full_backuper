# Airtable API Full Backuper

Backs up the record data (json, csv), table schemas (\_metadata.json) and attachments. Does not back up interfaces and automations.

This node.js script performs a full or partial backup of Airtable bases using the Airtable API.

## Features

    Backup one or all bases for a given Airtable account
    Save each base to a separate folder with JSON and CSV file per table
    Logs progress, errors, and statistics

Inspired by [airtable_full_backup](https://github.com/joe-irving/airtable_full_backup) by @joe-irving. Write in plain node.js - plz use v20.6+ version to inject .env without [dotenv](https://www.npmjs.com/package/dotenv).

## Set up

1. Go to [https://airtable.com/create/tokens/new](https://airtable.com/create/tokens/new)
2. Create an API token with Access "All current and future bases in all current and future workspaces" and the scopes:
    * `data.records:read`
    * `schema.bases:read`
3. Rename a `.env.example` to `.env` file in the base directory
4. Paste your token and backup dir name into `.env` file after `=`

## Usage

Clone the repo.
Set the following environment variables:

    AIRTABLE_ACCESS_TOKEN - your Airtable API token
    BACKUP_DIR - you backup dir path

Run: `npm start` for menu or `npm run all` for full backup or `node --env-file=.env airtable_backup.js --appXXXXXXXXXXXXXX` for backup base with ID appXXXXXXXXXXXXXX

Backups will be saved to the backups folder. Once it is done, you can zip and upload your backup to wherever you would like to keep it.