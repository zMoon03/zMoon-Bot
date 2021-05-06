const Discord = require('discord.js');
const bot = new Discord.Client();

//Token ODMyMzMyOTg3Mjk0MTU0ODIz.YHiQgA.4_tyhFRQugHmqsHFebCVgcnlDew
bot.login(process.env.token);
const prefix = "z/";

bot.on('message', (message) => {

    if(message.content == (prefix + 'flexdojo')){

        message.channel.send("FlexDojo's Infos \n Server IP: mc.flexdojo.it \n Discord: discord.com/FlexDojo \n Sito Web: www.flexdojo.it ");

    }else{

        return;

    }

    if(message.content == (prefix + 'zmoon')){

        message.channel.send("zMoon's Infos \n Telegram: @zSadBoy03 \n Discord: zMoon___#9072 \n GitHub: zMoon03 ");

    }else{

        return;
        
    }

});