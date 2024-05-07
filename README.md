# Hitori

Personal Use Discord Bot with DiscordJS. Features added as I need them

# TODOs

- Webapp to control bot besides having slash commands
- More Search Queries like has:file
- QoL things like bot displaying Progress

# Completed

- Archiving Function to Archive a single Discord Server into a SQLite Format
- Webapp for displaying archived Servers (lmk if anything is still missing)

# Archive Usage

- Put your Bot token and and Bot Client ID in `BotAPI/config/config.json`
- If you don't want to download media and store it in the Database, set `storeMediaLocally` in the config to `false`. When set to false it will only store the MediaURL, keep in mind though that when this URL doesn't work anymore, the media breaks as well, it is not recommended to set this to false. Keep in mind, that right now, ALL messages of the channel and their media are loaded when clicking on a channel, so not having media locally can use a lot of data.
- Run `npm run install:all` in the root dir to install dependencies
- Run `npm start` in the root dir
- Your Bot and Express Server should be running now and the React website availabe on localhost
- Invite the Bot to your Server and run `/archive`

# Archive Search Terms

- `from:userId` shows messages from a user with that ID
- `from:username` shows messages from a user with that username (or display name)
- `from:"user name"` shows messages from a user with displayname (or username) useful when a user has spaces in their name
- `after:DATE` shows messages after a specific Date. Date format: YYYY-MM-DD. You also only type 2024 (After Year 2024) or 2024-03 (After March 1st 2024)
- `before:DATE` shows messages before a specific Date. Date format: YYYY-MM-DD. You also only type 2024 (Before Year 2024) or 2024-03 (Before March 1st 2024)
- `has:TYPE` shows only messages containing this media type. For example `has:image` will only show messages with images. `has:pdf` will only show messages with PDFs.

`from` terms add up, meaning `from:userA from:userB` will show messages from userA AND userB

Everything without a specific search term will be used to filter the messages.
`Pumpkin Cake` will only show messages that contain "Pumpkin Cake" as a whole (not messages that contain either of those words or both words but not after one another)

Keep in mind that order does not matter, meaning `Pumpkin from:"User A" Cake` and `from:"User A" Pumpkin Cake` will both show messages from User A containing "Pumpkin Cake"

Searches are Case insensitive
