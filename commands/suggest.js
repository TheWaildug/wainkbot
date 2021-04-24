let channelid = "828999520120733777"
const Discord = require("discord.js")
const blacklistmongo = require("../blacklistmongo")
const HasPermissions = require("../isbypass")
module.exports = {
    name: "suggest",
    description: "suggest things",
    async execute(message,args,roles){
        let hasperm = await HasPermissions(roles,message.member)
        if(message.channel.id != "818890024178155603" && message.channel.id != "832040924267806750" && hasperm == false){
            return message.reply(`Please use this in <#818890024178155603>.`)
        }
        let isblacklisted = await blacklistmongo.findOne({user: message.member.id, type: "suggestion", blacklisted: true})
        console.log(isblacklisted)
        if(isblacklisted != null){
            return message.reply(`You have been blacklisted from making suggestions.`);
        }
        let avatar = message.author.displayAvatarURL({format: "png", dynamic: true, size: 128})
        console.log(avatar)
        let suggestion = args.join(" ")
        if(suggestion == ""){
            return message.reply(`I need a suggestion.`)
        }
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag,avatar)
        .setDescription(`**Suggestion:**\n${suggestion}`)
        .setColor("ff00f3")
        .setFooter(`Suggested`)
        .setTimestamp()
        let channel = message.guild.channels.cache.get(channelid)
        channel.send(embed).then(msg => {
            msg.react("👍")
            msg.react("👎")
            message.react("👍")
        })
    }
}