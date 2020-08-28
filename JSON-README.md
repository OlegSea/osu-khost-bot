# config.json
* "login" - Your osu!irc login. Can be found [here](osu.ppy.sh/p/irc).
* "password" - Your osu!irc password. Can be found [here](osu.ppy.sh/p/irc).
* "apiKey" - You can get one [here](osu.ppy.sh/p/api) by using data like [this](https://imgur.com/a/oYPpAzg).
* "lobbyName" - Name of the lobby (Pretty obvious, isn't it?).
* "lobbyPassword" - Password of the lobby. Use "" for no password.
* "commandPrefix" - Prefix that will be used for PM commands. For example, if prefix is set to ".", commands will look like ".help".
* "teamMode" - Team mode of the lobby.
  * "HeadToHead" = 0
  * "TagCoop" = 1
  * "TeamVs" = 2
  * "TagTeamVs" = 3
* "winCondition" - Win Condition of the lobby.
  * "Score" = 0
  * "Accuracy" = 1
  * "Combo" = 2
  * "ScoreV2" = 3
* "afkTimer" - Time after which the host switches, if the map wasn't changed.
* "msg_welcome" - Message that will be sent to new player in the lobby.
# userList.json
Every player in this list has two parameters.
* "userName* - Username of the player (Pretty obvious, isn't it?).
* "permissionLevel" - Permission level. See PM commands.
# PM Commands
Prefix + Keyword.
* permissionLevel:0
  * "info" - Display message for new players.
  * "discord" - My discord.
  * "github" - This repo.
* permissionLevel:1
  * "host" - Change the host.
  * "settings" - Change the settings.
  * "mods" - Change the mods.
* permissionLevel:2
  * "close" - Close the lobby.
  * "restart" - Close the lobby and create a new one.
  * "stop" - Manually stop the bot.
