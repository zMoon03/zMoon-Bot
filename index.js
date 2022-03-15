const Discord = require("discord.js");
const { Intents, MessageEmbed } = require("discord.js");
var tcpp = require('tcp-ping');
var request = require("request");

const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

bot.login("OTUzMzQ5MzMzMzg5MDE3MTA4.YjDRwQ.a-4QqruoIbRyM3RIKK5FUBOKAEs");

const prefix = '!';

const fs = require('fs');
const { version } = require("os");

bot.once('ready', () => {
    console.log('Bot is Online!');
});

bot.on('message', (message) => {

    if (message.content == (prefix + 'nome')) {

        message.channel.send();

    }

    if (message.content == (prefix + 'ip')) {
        message.channel.send("mc.calabriacity.it \n");
    }

    if (message.content.startsWith(prefix + "ping")) {
        //Made with ❤️ by Voltix
        var dns = message.content.split(" ")[1];

        message.channel.send(":arrows_counterclockwise: Sto controllando il server").then((sendMessage) => {
            var pingMs = "";
            try {
                var url = "";
                if (dns == undefined) {
                    url = "https://api.mcsrvstat.us/2/mc.calabriacity.it";
                } else {
                    url = "https://api.mcsrvstat.us/2/" + dns;
                }

                request({
                    url: url,
                    json: true
                }, function (error, response, body) {

                    if (!error && response.statusCode === 200) {
                        if (body.ping != "false" && body.ip != "127.0.0.1") {
                            tcpp.ping({ address: body.ip, port: 25565 }, function (err, data) {
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
                                        .setFooter(
                                            `Richiesto da ${message.author.tag}`,
                                            message.author.displayAvatarURL(),
                                        )
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
                                .setFooter(
                                    `Richiesto da ${message.author.tag}`,
                                    message.author.displayAvatarURL(),
                                )
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
