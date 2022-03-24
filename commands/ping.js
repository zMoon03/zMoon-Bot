module.exports = {
    name: 'ping',
    description: 'Restituisce delle informazioni sul server desiderato.'
  }
const prefix = '!';
const tcpp = require('tcp-ping');
const request = require("request");
const dnsLib = require("dns");
const { Client, Collection, Intents, Discord } = require("discord.js");
const { MessageEmbed } = require("discord.js");
module.exports.execute = async function (message) {
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
                                            ":pencil2: MOTD: " + body.motd.clean + "\n " +
                                            ":wrench: Version: " + body.version
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
}