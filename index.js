const Discord = require('discord.js');
const bot = new Discord.Client();

//Token ODMyMzMyOTg3Mjk0MTU0ODIz.YHiQgA.4_tyhFRQugHmqsHFebCVgcnlDew
bot.login(process.env.token);

bot.on('message', (message) => {

    if(message.content == 'zflexdojo'){

        message.channel.send("\nServer IP: mc.flexdojo.it \n Discord: discord.com/FlexDojo \n Sito Web: www.flexdojo.it ");

    }

});