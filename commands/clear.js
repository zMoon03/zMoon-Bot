module.exports = {
    name: 'clear',
    description: 'Restituisce delle informazioni sul server desiderato.',
}
const prefix = '!';
const { MessageEmbed } = require("discord.js");
module.exports.execute = async function (message) {
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
}
