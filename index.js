
const Discord = require("discord.js");
const { Intents, MessageEmbed } = require("discord.js");
const tcpp = require('tcp-ping');
const status = require('minecraft-server-status-improved');
//const status = require('minecraft-server-status');
const request = require("request");
const dnsLib = require("dns");

const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

bot.login("OTUzMzQ5MzMzMzg5MDE3MTA4.YjDRwQ.a-4QqruoIbRyM3RIKK5FUBOKAEs");

const prefix = '!';

const fs = require('fs');
const { version } = require("os");

bot.once('ready', () => {
    console.log('Bot is Online!');
});

bot.on('messageCreate', (message) => {

    if (message.content == (prefix + 'nome')) {

        message.channel.send();

    }

    if (message.content == (prefix + 'ip')) {
        message.channel.send("mc.calabriacity.it \n");


    }

    if (message.content.startsWith(prefix + "ping")) {
        //Made with ❤️ by Voltix
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
                            if(body.ip != false) {
                                serverIp = body.ip;
                            } else {
                                dnsLib.lookup(dns, (err, address, family) => {
                                    if(err) throw err;
                                    if(address != null) {
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
                                            ":bust_in_silhouette: Players online: **" + body.players.online + "/" + body.players.max + "**"
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

