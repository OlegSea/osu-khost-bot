const fs = require('fs');
let config = JSON.parse(fs.readFileSync('config.json'));
let userList = JSON.parse(fs.readFileSync('userList.json'));

const afkTimer = config["afkTimer"];
let currentAfkTimer = afkTimer;

const Banchojs = require("bancho.js");
const client = new Banchojs.BanchoClient({ username: config["login"], password: config["password"], apiKey: config["apiKey"]});

var cHost;

const cmdPrefix = config["commandPrefix"];

let lobby;

var beatmapChanged = false;

function hostRotate (currentHost, slots, timer) {
    setTimeout(() => {
        players = [];
        for (var i = 0; i < lobby.size; i++) {
            if (slots[i] !== null) players.push(slots[i].user.ircUsername)
        }
        var nextHost = players.indexOf(currentHost) + 1
        if (nextHost > players.length - 1) lobby.setHost(players[0])
        else lobby.setHost(players[nextHost])}, timer);
}

client.connect().then(async () => {
	console.log("We're online!");
	const channel = await client.createLobby(config["lobbyName"]);
	lobby = channel.lobby;
    await Promise.all([lobby.setMap(1012131), lobby.setPassword(config["lobbyPassword"])]);
    lobby.setSettings(config["teamMode"], config["winCondition"])
	console.log("Lobby created! Name: "+lobby.name);
    console.log("Multiplayer link: https://osu.ppy.sh/mp/"+lobby.id);
    var players = []
	lobby.on("playerJoined", (obj) => {
        setTimeout(() => {
            msg_welcome = JSON.parse(fs.readFileSync('config.json'))["msg_welcome"];
            obj.player.user.sendMessage(msg_welcome);
            players = [];
            for (var i = 0; i < lobby.size; i++) {
                if (lobby.slots[i] !== null) players.push(lobby.slots[i].ircUsername)
            }
            if (players.length === 1) lobby.setHost(obj.player.user.ircUsername)
            }, 1000);
    });

	lobby.on("matchFinished", () => {
        currentAfkTimer = afkTimer;
        try {
            cHost = lobby.getHost().user.ircUsername;
        } catch (UnhandledPromiseRejectionWarning) {
            players = [];
            for (var i = 0; i < lobby.size; i++) {
                if (lobby.slots[i] !== null) players.push(lobby.slots[i].user.ircUsername);
            }
            lobby.setHost(players[0]);
        }
        if (lobby.slots.filter(player => player != null).length > -1 && lobby.getHost().user.ircUsername == cHost) hostRotate(lobby.getHost().user.ircUsername, lobby.slots, 5000);
        beatmapChanged = false;
    });
    lobby.on("allPlayersReady", () => {
        currentAfkTimer = afkTimer;
        lobby.startMatch(5);
    });
    lobby.on("name", () => {
        lobby.getHost.user.sendMessage("pls don't change lobby name")
        hostRotate(lobby.getHost().user.ircUsername, lobby.slots, 1000);
    });
    lobby.on("passwordChanged", () => {
        lobby.getHost.user.sendMessage("pls don't change password")
        hostRotate(lobby.getHost().user.ircUsername, lobby.slots, 1000);
    });
    lobby.on("teamMode", () => {
        lobby.getHost.user.sendMessage("pls don't change game team mode");
        hostRotate(lobby.getHost().user.ircUsername, lobby.slots, 1000);
    });
    lobby.on("winCondition", () => {
        lobby.getHost.user.sendMessage("pls don't change win condition");
        hostRotate(lobby.getHost().user.ircUsername, lobby.slots, 1000);
    });
    lobby.on("beatmapId", () => {
        beatmapChanged = true;
    });
    client.on("PM", async ({user, message}) => {
        if (message[0] !== cmdPrefix) return;
        const command = message.split(" ")[0].toLowerCase();
        userList = JSON.parse(fs.readFileSync('userList.json'));
        switch (command) {
            case cmdPrefix + "stop":
                for (var i = 0; i < userList["admin"].length; i++) {
                    if (userList["admin"][i]["userName"] === user.ircUsername && userList["admin"][i]["permissionLevel"] >= 2) {
                        process.exit(-1);
                    }
                }
                break;
            case cmdPrefix + "restart":
                for (var i = 0; i < userList["admin"].length; i++) {
                    if (userList["admin"][i]["userName"] === user.ircUsername && userList["admin"][i]["permissionLevel"] >= 2) {
                        lobby.closeLobby();
                        const channel = await client.createLobby(config["lobbyName"]);
	                    lobby = channel.lobby;
                        await Promise.all([lobby.setMap(1012131), lobby.setPassword(config["lobbyPassword"])]);
                        lobby.setSettings(config["teamMode"], config["winCondition"])
	                    console.log("Lobby created! Name: "+lobby.name);
                        console.log("Multiplayer link: https://osu.ppy.sh/mp/"+lobby.id);
                    }
                }
                    break;
            case cmdPrefix + "close":
                for (var i = 0; i < userList["admin"].length; i++) {
                    if (userList["admin"][i]["userName"] === user.ircUsername && userList["admin"][i]["permissionLevel"] >= 2) {
                        lobby.closeLobby();
                    }
                }
                break;
            case cmdPrefix + "host":
                for (var i = 0; i < userList["admin"].length; i++) {
                    if (userList["admin"][i]["userName"] === user.ircUsername && userList["admin"][i]["permissionLevel"] >= 1) {
                        lobby.setHost(message.split(" ")[1]);
                    }
                }
                break; 
            case cmdPrefix + "settings":
                for (var i = 0; i < userList["admin"].length; i++) {
                    if (userList["admin"][i]["userName"] === user.ircUsername && userList["admin"][i]["permissionLevel"] >= 1) {
                        lobby.setSettings(message.split(" ")[1], message.split(" ")[2]);
                    }
                }
                break; 
            case cmdPrefix + "mods":
                for (var i = 0; i < userList["admin"].length; i++) {
                    if (userList["admin"][i]["userName"] === user.ircUsername && userList["admin"][i]["permissionLevel"] >= 1) {
                        lobby.setMods(message.split(" ")[1], message.split(" ")[2]);
                    }
                }
                break;
            case cmdPrefix + "info":
                msg_welcome = JSON.parse(fs.readFileSync('config.json'))["msg_welcome"];
                user.sendMessage(msg_welcome);
                break;
            case cmdPrefix + "lobbyinfo":
                user.sendMessage("Name:" + lobby.name);
                user.sendMessage("Players:");
                players = lobby.slots.filter(player => player != null);
                for (var i = 0; i < players.length;i++) user.sendMessage(players[i].user.ircUsername+ '');
                user.sendMessage("Map:" + lobby.beatmapId);
                user.sendMessage("Host:" + lobby.getHost().user.ircUsername);
                for (var i = 0; i < lobby.mods.length;i++) user.sendMessage(lobby.mods[i]+ '');
                user.sendMessage("Freemod:" + lobby.freemod);
                user.sendMessage("Settings:" + lobby.teamMode + "" + lobby.winCondition);
                break;
            case cmdPrefix + "discord":
                user.sendMessage("My discord is OlegSea#1334");
                break;
            case cmdPrefix + "github":
                user.sendMessage("GitHub link: https://github.com/OlegSea/osu-khost-bot");
                break;
        }
    });
}).catch(console.error);

setInterval(function () {
    if (lobby != null
        && lobby.name != ""
        && lobby.playing == false
        && lobby.slots.filter(player => player != null).length > 1
        && beatmapChanged == false) {

        currentAfkTimer -= 1;

        if (currentAfkTimer == 0) {
            hostRotate(lobby.getHost().user.ircUsername, lobby.slots, 1000);
            currentAfkTimer = afkTimer;
        }
        lobby.on("beatmap", () => {
            currentAfkTimer = afkTimer;
        });
    }
    else {
        currentAfkTimer = afkTimer;
    }
}, 1000);

process.on("SIGINT", async () => {
	console.log("Closing lobby and disconnecting...");
	await lobby.closeLobby();
	await client.disconnect();
});
