const fs = require('fs');
const { Client, Collection, Intents, Discord, GuildMember, GuildMemberRoleManager } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const tcpp = require('tcp-ping');
const request = require("request");
const dnsLib = require("dns");
const wait = require('util').promisify(setTimeout);
const { joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require('ytdl-core');
//const { Player } = require('discord-player');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    disableMentions: 'everyone',
});

client.config = require('./config.json');

client.commands = new Collection();

client.login("OTUzMzQ5MzMzMzg5MDE3MTA4.YjDRwQ.pLwPrRmMiKvjTm9J0avBnmKIr0Y");

const prefix = client.config.prefix;

var paroleBandite = ['dio cane', 'puttana', 'fuck', 'merda', 'fanculo', 'server di merda', 'porca madonna', 'porco dio'];

const { version } = require("os");
const { string, arrayOfString, number } = require("assert-plus");
const { __values } = require("tslib");

client.once('ready', () => {
    console.log('Bot is Online!');
    console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);
    client.user.setStatus("idle");

});

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'discordbot',
    charset: 'utf8mb4_general_ci'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

console.log(`Loading commands...`);
const fileComandi = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of fileComandi) {
    const commando = require(`./commands/${file}`);
    console.log(`-> Loaded command ${commando.name.toLowerCase()}`);
    client.commands.set(commando.name.toLowerCase(), commando);
    delete require.cache[require.resolve(`./commands/${file}`)];
}

client.on('messageCreate', async message => {

    const args = message.content.slice(prefix.length).split(/ +/);
    const comando = args.shift().toLowerCase();

    if (comando === 'clear') {
        client.commands.get('clear').run(message);
    }
    if (comando === 'ping') {
        client.commands.get('ping').run(message);
    }

    if (new RegExp(paroleBandite.join("|")).test(message.content.toString().toLowerCase())) {
        const newEmbed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('**Warn**')
            .setDescription(
                ":x: **Hai usato una parola bandita** \nSe arriverai a 3 warn verrai mutato"
            )
            .setTimestamp();
        message.author.send({ embeds: [newEmbed] });
        message.delete();
        var user = message.author.id;
        var username = message.author.username;
        connection.query(`SELECT warn FROM userDatas WHERE userID =${user}`, function (err, results, fields) {
            if (!results.length > 0) {
                connection.query(`INSERT INTO userDatas (username, userID, warn) VALUES ("${username}", ${user}, 1)`);
                console.log(`User ${username} inserito nel database`);
            } else {
                connection.query(`UPDATE userDatas SET warn = warn + 1 WHERE userID = ${user}`);
                console.log(`Warn aggiornato per ${username}`);
            }

            if (results >= 3) {

            }
        })
    }
});