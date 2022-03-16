const { Permissions, MessageEmbed } = require("discord.js")

const db = require("quick.db")

let wrong = "#F04A47"
let right = "#43B581"

module.export = {
    name: "warn",
    description: "Warn user",
    usage: "warn <user> <reason>",
    timeout: "4000",
    category: "moderation",
    run: async(bot, message, args) => {
        try{

            const check = bot.emojis.cache.find(x => x.name === "CheckMark")
            const cross = bot.emojis.cache.find(x => x.name === "WrongMark")

            if(!message.member.Permissions.has(Permissions.FLAGS.KICK_MEMBERS)){
                const embed = new MessageEmbed()
                .setTitle(``)
                .setDescription(`**${cross} Missing permissions to kick members**`)
                .setColor(wrong)
                return message.cahnnel.send({embeds : [embed]})
            }

            const target = message.mentions.user.first()
            if(!target){
                const embed = new MessageEmbed()
                .setTitle(``)
                .setDescription(`**${cross} You must mention the user you want warned**`)
                .setColor(wrong)
                return message.cahnnel.send({embeds : [embed]})
            }


            if(target.id === bot.user.id){
                const embed = new MessageEmbed()
                .setTitle(``)
                .setDescription(`**${cross} You can't warn bots**`)
                .setColor(wrong)
                return message.cahnnel.send({embeds : [embed]})
            }


            if(target.id === message.author.id ){
                const embed = new MessageEmbed()
                .setTitle(``)
                .setDescription(`**${cross} Sorry but you can't warn yourself**`)
                .setColor(wrong)
                return message.cahnnel.send({embeds : [embed]})
            }


            if(message.member.roles.highest.comparePositionTo(message.mentions.members.first().roles.highest) < 1){
                const embed = new MessageEmbed()
                .setTitle(``)
                .setDescription(`**${cross} Sorry but you can't warn an user with highest role**`)
                .setColor(wrong)
                return message.cahnnel.send({embeds : [embed]})
            }

            let reason = args.slice(1).join(" ")

            if(!reason){
                const embed = new MessageEmbed()
                .setTitle(``)
                .setDescription(`**${cross} Please provide a valid reason**`)
                .setColor(wrong)
                return message.cahnnel.send({embeds : [embed]})
            }

            db.add(`warn_${target.id}`, 1)
            let x = db.get(`warns_${target.id}`)

            const embed = new MessageEmbed()
            .setTitle(``)
            .setDescription(`**${check} ${target.username} has been warned with ${x} now**`)
            .setColor(right)
            return message.cahnnel.send({embeds : [embed]})

            try{
                let embed = new MessageEmbed()
                .setTitle
                .setDescription(`**:warning: You have been warned in ${message.guild.name} 
                by ${message.author.username}**`)
                .setColor(wrong)
                .setFooter(`Reason: ${reason}`)
                target.send({embeds : [embed]})
                
            }catch(err){
                const embed = new MessageEmbed()
                .setTitle(``)
                .setDescription(`**${cross} I can't send messages to that user**`)
                .setColor(wrong)
                return message.cahnnel.send({embeds : [embed]})
            }


        }catch(err){
            console.log(err)
            const embed = new MessageEmbed()
            .setTitle(``)
            .setDescription(`**${cross} An unknow error occured**`)
            .setColor(wrong)
            return message.cahnnel.send({embeds : [embed]})
        }
    }
}