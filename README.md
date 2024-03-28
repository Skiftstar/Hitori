# Hitori
Personal Use Discord Bot with DiscordJS. Features added as I need them

# TODOs
- Webapp to control bot besides having slash commands
- Webapp for displaying archived Servers

# Completed
- Archiving Function to Archive a single Discord Server into a SQLite Format

# Archive Usage
- Put your Bot token and and Bot Client ID in `BotAPI/config/config.json`
- If you don't want to download media and store it in the Database, set `storeMediaLocally` in the config to `false`.
- Run `npm run install:all` in the root dir to install dependencies
- Run `npm start` in the root dir
- Your Bot and Express Server should be running now and the React website availabe on localhost
- Invite the Bot to your Server and run `/archive`
