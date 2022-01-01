const channelid = "828999520120733777"
const RequiredRoles = require("../../values/roles")
const HasPermissions = require("../../isbypass")
const blacklistmongo = require("../../blacklistmongo")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: ["suggest"],
    description: `Makes a suggestion for the server.`,
    requiredRoles: "@everyone",
    minArgs: 1,
    maxArgs: null,
    expectedArgs: "<suggestion>",
    permissionError: `If you can see this, something went wrong.`,
    Category: `Utility`,
    callback: async (message,args,text) => {
        let hasperm = await HasPermissions(RequiredRoles,message.member)
        if(message.channel.id != "818890024178155603" && message.channel.id != "832040924267806750" && hasperm == false){
            const embed = await CreateEmbed({title: "Permissions Error", description: `Whoops! Make sure to use this command in <#818890024178155603>.`, color: "RED"})
            message.channel.send(embed)
            message.delete();
            return;
        }
        let isblacklisted = await blacklistmongo.findOne({user: message.member.id, type: "suggestion", blacklisted: true})
        console.log(isblacklisted)
        if(isblacklisted != null){
            const embed = await CreateEmbed({title: "Permission Denied", description: `You have been blacklisted from making suggestions.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        let channel = message.guild.channels.cache.get(channelid)
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the suggestion channel.`, color: "RED"})
            message.channel.send(embed)
            
            return;
        }
        let avatar = message.author.displayAvatarURL({format: "png", dynamic: true, size: 128});
        console.log(avatar)
        let suggestion = text;
        const embed = await MakeEmbed({author: {name: `${message.author.tag}`, iconURL: `${avatar}`}, description: `**Suggestion:**\n${suggestion}`, color: "ff00f3", footer: {text: `Suggested`}, timestamp: Date.now()})
        channel.send(embed).then(msg => {
            msg.react("👍")
            msg.react("👎")
            message.react("👍")
        })
    }
}
