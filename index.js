const Discord = require('discord.js');
const bot = new Discord.Client();

//Token ODMyMzMyOTg3Mjk0MTU0ODIz.YHiQgA.4_tyhFRQugHmqsHFebCVgcnlDew
bot.login(process.env.token);

bot.on('message', (message) => {

    if(message.content == '!flexdojo'){

        message.channel.send("Server IP: mc.flexdojo.it \n Discord: https://discord.com/FlexDojo \n Sito Web: http://www.flexdojo.it/ ");

    }

});