// ---REQUIREMENTS---

import {createRequire} from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const cron = require("cron")
const Discord = require("discord.js");
require('dotenv').config({path:"./.env"});



// ---COMMON VARIBLES---

const client = new Discord.Client();
const audiofiles = fs.readdirSync("./audio/audioRecords")
let isReady = true
let jhinVoiceLines = fs.readdirSync("./audio/jhinVoiceLines");



// ---FUNCTIONS---

// basic sleep function
function sleep(ms)
{
	return (new Promise(resolve => setTimeout(resolve, ms)))
}

// main function to play an audio file
async function play_song(song_to_play, msg)
{
	const voice_channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_RADIO);

	if (msg === 3)
		await sleep(1000);
	voice_channel.join().then(connection =>
	{
		connection.play(song_to_play);
		setTimeout(() => 
		{
			voice_channel.leave();
		}, msg * 1000);
	}).catch(err => console.log("this is an error: ", err));
}



// ---EVENTS---

// On ready event
client.on("ready", () =>
{
	const voice_channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_RADIO);

	console.log(`Logged in as ${client.user.tag}!`)

	let scheduledMessage = new cron.CronJob("00 43 * * * *", () =>
	{
		if (voice_channel.members.size >= 1)
		{
			play_song("./audio/jhinVoiceLines/" + jhinVoiceLines[Math.floor(Math.random() * jhinVoiceLines.length)], 8);
		}
	})
	scheduledMessage.start()
	
});

// On voice chat change event
client.on('voiceStateUpdate', (oldMember, newMember) =>
{
	const voice_channel = client.channels.cache.find(channel => channel.id === process.env.CHANNEL_RADIO);
	let newUserChannel = newMember.channelID;
	let oldUserChannel = oldMember.channelID;

	if (oldMember.member.roles.cache.find(r => r.name === "bots") || newUserChannel === oldUserChannel || isReady != true)
		return;

	isReady = false
	if (newUserChannel === process.env.CHANNEL_RADIO)
	{
		play_song("./audio/incoming.m4a", 3);
	}
	else if (oldUserChannel === process.env.CHANNEL_RADIO && voice_channel.members.size >= 1)
	{
		play_song(audiofiles[Math.floor(Math.random() * audiofiles.length)], 2);
	}
	isReady = true
});

client.login(process.env.TOKEN);
