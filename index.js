const Discord = require('discord.js');
const bot = new Discord.Client();


//Token ODMyMzMyOTg3Mjk0MTU0ODIz.YHiQgA.4_tyhFRQugHmqsHFebCVgcnlDew
bot.login(process.env.token);
const prefix = "=";


bot.on('message', (message) => {

    if(message.content == (prefix + 'flexdojo')){

        message.channel.send("FlexDojo's Infos \n Server IP: mc.flexdojo.it \n Discord: discord.com/FlexDojo \n Sito Web: www.flexdojo.it ");

    }

    if(message.content == (prefix + 'zmoon')){

        message.channel.send("zMoon's Infos \n Telegram: @zMoon03 \n Discord: zMoon___#9072 \n GitHub: zMoon03 ");

    }
    
    if(message.content == (prefix + '5B')){
        
        message.channel.send("\n La classe è composta da 23 studenti di cui 21 sono maschi e 2 femmine.");
    }
})
