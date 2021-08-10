import {createRequire} from "module";
const require = createRequire(import.meta.url);
const Discord = require("discord.js");
require('dotenv').config({path:"./.env"});

const client = new Discord.Client();
let isReady = true
const audiofiles = ["./audio/fdp.m4a", "./audio/connard.m4a", "./audio/enculé.m4a"]

function play_song(song_to_play, msg)
{
	setTimeout(() => 
	{
		console.log("bonjour");
	}, 2000);
	const voice_channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_RADIO);
	//const text_channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_TEXT);

	voice_channel.join().then(connection =>
	{
		//text_channel.send(msg);
		//console.log("Successfully connected");
		connection.play(song_to_play);
		setTimeout(() => 
		{
			voice_channel.leave();
		}, 2000);
	}).catch(err => console.log("this is an error: ", err));
}

// On ready event
client.on("ready", () =>
{
	console.log(`Logged in as ${client.user.tag}!`)
});

// On voice chat change event
client.on('voiceStateUpdate', (oldMember, newMember) =>
{
	if (oldMember.member.roles.cache.find(r => r.name === "bots"))
		return;
	let newUserChannel = newMember.channelID;
	let oldUserChannel = oldMember.channelID;

	if (newUserChannel === process.env.CHANNEL_RADIO)
	{
		play_song("./audio/incoming.m4a", "\nBienvenue sur RadioJhin !");
	}
	else if (oldUserChannel === process.env.CHANNEL_RADIO && client.channels.cache.find(channel => channel.id === process.env.CHANNEL_RADIO).members.size >= 1)
	{
		play_song(audiofiles[Math.floor(Math.random() * 3)], "JhinRadio");
	}
});

client.login(process.env.TOKEN);
