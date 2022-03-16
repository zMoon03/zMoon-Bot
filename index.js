
const Discord = require("discord.js");
const { Intents, MessageEmbed } = require("discord.js");
const tcpp = require('tcp-ping');
const request = require("request");
const dnsLib = require("dns");

var paroleBandite = ['dio cane', 'puttana', 'fuck', 'merda', 'fanculo', 'server di merda', 'porca madonna', 'porco dio'];

const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

bot.login("OTUzMzQ5MzMzMzg5MDE3MTA4.YjDRwQ.a-4QqruoIbRyM3RIKK5FUBOKAEs");

bot.commands = new Discord.Collection();

const fs = require('fs');


const prefix = '!';

const { version } = require("os");
const { string } = require("assert-plus");
const { __values } = require("tslib");

bot.once('ready', () => {
    console.log('Bot is Online!');
});

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bot',
    charset: 'utf8mb4_general_ci'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


bot.on('messageCreate', (message) => {

    if (new RegExp(paroleBandite.join("|")).test(message.content.toString().toLowerCase())) {
        const newEmbed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('**Warn**')
            .setDescription(
                ":x: **Hai usato una parola bandita**"
            )
            .setTimestamp();
        message.author.send({ embeds: [newEmbed] });
        warnNum = connection.query("SELECT warn FROM userData WHERE userID = "+ message.author);
        var $user = connection.query("SELECT userID FROM userData WHERE userID = "+ message.author);
        if ($user == message.author){
            let warnNum = connection.query("SELECT warn FROM userData WHERE userID = "+ message.author);
            connection.query(`UPDATE userData SET warn = ${warnNum++} `);
            console.log("Warn aggiornato");

        }else{
            connection.query(`INSERT INTO userData (userID, warn) VALUES (`+ message.author + ` , ${warnNum++})`);
            console.log("User creato");
        }
        message.delete();
    }

    if (message.content.startsWith(prefix + 'clear')) {
        var clear = message.content.split(" ")[1];
        message.delete();
        if (!message.content.includes(clear)) {
            const newEmbed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('**Clear**')
                .setDescription(
                    ":x: **Inserisci il numero di messaggi da cancellare**"
                )
                .setTimestamp();
            message.channel.send({ embeds: [newEmbed] }).then((send) => { setTimeout(() => { send.delete() }, 2500); });
        } else if (clear <= 0 || clear > 100) {
            const newEmbed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('**Clear**')
                .setDescription(
                    ":x: **Inserire un valore tra 1 e 100**"
                )
                .setTimestamp();
            message.channel.send({ embeds: [newEmbed] }).then((send) => { setTimeout(() => { send.delete() }, 2500); });
        } else {
            message.channel.bulkDelete(clear, true).then((messages) => {
                message.channel.send("Ho rimosso " + messages.size + " messaggi. :boom:").then((send) => { setTimeout(() => { send.delete() }, 2500); });
            })
        }
    }

    if (message.content.startsWith(prefix + "ping")) {
        var userInput = message.content.split(" ")[1];

        message.channel.send(":arrows_counterclockwise: Sto controllando il server").then((sendMessage) => {
            var pingMs = "";
            try {
                var url = "";
                if (userInput == undefined) {
                    sendMessage.delete();
                    const newEmbed = new MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle('**Errore**')
                        .setDescription(
                            ":x: **Specifica l'ip del server!**"
                        )
                        .setFooter({
                            text: "Richiesto da " + message.author.tag,
                            iconURL: message.author.displayAvatarURL(),
                        })
                        .setTimestamp();
                    message.channel.send({ embeds: [newEmbed] });
                } else {
                    url = "https://api.mcsrvstat.us/2/" + userInput;
                }

                request({
                    url: url,
                    json: true
                }, function (error, response, body) {

                    if (!error && response.statusCode === 200) {
                        //console.log(body);

                        if (body.debug.ping != false && body.online != false && body.ip != "127.0.0.1") {

                            var portNumber = (!userInput.includes(":")) ? 25565 : userInput.split(":")[1];
                            var dns = (!userInput.includes(":")) ? userInput : userInput.split(":")[0];

                            var serverIp = "";
                            if (body.ip != false) {
                                serverIp = body.ip;
                            } else {
                                dnsLib.lookup(dns, (err, address, family) => {
                                    if (err) throw err;
                                    if (address != null) {
                                        serverIp = address;
                                    }
                                });
                            }

                            tcpp.ping({ address: body.ip, port: portNumber }, function (err, data) {
                                pingMs = parseInt(data.min) + " ms";
                                if (data.max != undefined) {
                                    sendMessage.delete();
                                    const newEmbed = new MessageEmbed()
                                        .setColor('#1EFF00')
                                        .setTitle('**Server online**')
                                        .setDescription(
                                            ":white_check_mark: Il server è **online**! \n" +
                                            ":video_game: IP server: **" + body.hostname + "**\n" +
                                            ":globe_with_meridians: Il suo ping è: **" + pingMs + "**\n" +
                                            ":bust_in_silhouette: Players online: **" + body.players.online + "/" + body.players.max + "**\n" +
                                            ":pencil2: MOTD: " + body.motd.clean
                                        )
                                        .setFooter({
                                            text: "Richiesto da " + message.author.tag,
                                            iconURL: message.author.displayAvatarURL(),
                                        })
                                        .setTimestamp();
                                    message.channel.send({ embeds: [newEmbed] });
                                }


                            })
                        } else {
                            sendMessage.delete();
                            const newEmbed = new MessageEmbed()
                                .setColor('#FF0000')
                                .setTitle('**Server offline**')
                                .setDescription(
                                    ":x: Il server è **offline**!"
                                )
                                .setFooter({
                                    text: "Richiesto da " + message.author.tag,
                                    iconURL: message.author.displayAvatarURL(),
                                })
                                .setTimestamp();
                            message.channel.send({ embeds: [newEmbed] });

                        }

                    }

                })
            } catch (err) {
                sendMessage.edit(":x: Il server è offline!");
            }

        });

    }
});