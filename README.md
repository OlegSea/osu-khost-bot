# osu-khost-bot
 A bot that automatically creates a lobby and switches the host after each match. It uses [bancho.js](https://bancho.js.org/index.html).
# How to install and run
 1. Install [NodeJS](https://nodejs.org/en/download/)
 2. Open config.json in cloned repo folder.
 3. Fill your Login, [IRC Password](https://osu.ppy.sh/p/irc) and [API Key](https://osu.ppy.sh/p/api). Also you can change some other lines.
 4. Execute this in cmd:
```
node *path-to-the-cloned-repo*/app.js
```
 5. Done. You can join lobby in osu! Name of it will be displayed in console. 
# What does it do?
 It does:
 1. Automatically create lobby with specified settings.
 2. Automatically give host to the player, who has joined in empty lobby.
 3. Automatically give host to the next player in lobby after match finished.
 4. Detect if current host goes AFK and give host to the next player.
 5. Allow you to control the lobby by sending PMs to the bot (will be improved by adding new commands).
 6. Detect changes in lobby settings (currently not working).
 7. Detect if the beatmap does not match the specified parameters (to-do).
# More Info
 This project is currently in development.  All the documentation can be found in `JSON-README.md`. If you have any issues/suggestions, write them here or PM me in Discord (OlegSea#1334). I will reply as soon as I can. And yes, [AutoHost](https://www.reddit.com/r/osugame/comments/67u0k9/autohost_bot_is_finally_ready_for_public_usage/) is better.
# Links
* [Forum post](https://osu.ppy.sh/community/forums/topics/1084221)
