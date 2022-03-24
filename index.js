const fs = require('fs');
const { Client, Collection, Intents, Discord, GuildMember, GuildMemberRoleManager } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const tcpp = require('tcp-ping');
const request = require("request");
const dnsLib = require("dns");
const wait = require('util').promisify(setTimeout);
const config = require('./config.json');
const lokijs = require("lokijs");
const Sequelize = require('sequelize');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

client.login(config.token);

const prefix = config.prefix;

var paroleBandite = ['dio cane', 'puttana', 'fuck', 'merda', 'fanculo', 'server di merda', 'porca madonna', 'porco dio'];

const { version } = require("os");
const { string, arrayOfString, number } = require("assert-plus");
const { __values } = require("tslib");


client.once('ready', () => {
    console.log('Bot is Online!');
    client.emojis.cache;
    
});

const mysql = require('mysql');
const { channel } = require('diagnostics_channel');
const { measureMemory } = require('vm');
const { connect } = require('http2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'warnbot',
    charset: 'utf8mb4_general_ci'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const fileComandi = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of fileComandi) {
    const comando = require(`./commands/${file}`);
    client.commands.set(comando.name, comando);
}

client.on('messageCreate', async message => {

    const args = message.content.slice(prefix.length).split(/ +/);
    const comando = args.shift().toLowerCase();

    if (comando === 'clear') {
        client.commands.get('clear').execute(message);
    }
    if (comando === 'ping') {
        client.commands.get('ping').execute(message);
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
        connection.query(`SELECT warn FROM userDatas WHERE userID =${user}`,function(err, results, fields){
            if (!results.length > 0) {
                connection.query(`INSERT INTO userDatas (userID, warn) VALUES (${user}, 1)`);
                console.log(`User ${user} inserito nel database`);
            } else  {
                connection.query(`UPDATE userDatas SET warn = warn + 1 WHERE userID = ${user}`);
                console.log(`Warn aggiornato per ${user}`);
            }

            if(results.length >= 3){
                
            }
        })

    }
});