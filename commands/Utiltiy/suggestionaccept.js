let channelid = "828999520120733777"
const MakeEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
module.exports = {
    commands: ["suggestionaccept","acceptsuggestion","saccept","as","sa"],
    description: "Accepts a suggestion from <#828999520120733777>.",
    requiredRoles: ["832747239809613834"],
    expectedArgs: "<messageID> <reason>",
    minArgs: 2,
    maxArgs: null,
    Category: "Utility",
    permissionError: "You cannot run this command.",
    callback: async (message,args,prefix,alias) => {
        if(message.channel.id != "828999520120733777" && message.channel.id != "816862529564573746" && message.channel.id != "832040924267806750"){
            const embed = await MakeEmbed({title: "Permissions Error", description: `Please run this in the staff channel or suggestion channel.`, color: "RED"})
            message.channel.send(embed)
            message.delete();
            return;
        }
        if(isNaN(args[0])){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} <messageID> <reason>\`.`, color: "RED"})
                 
                    message.channel.send(embed)
                    return;
        }
        const channel = message.guild.channels.cache.get(channelid)
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the suggestion channel.`, color: "RED"})
            message.channel.send(embed)
            
            return;
        }
        let msg = await channel.messages.fetch(args[0]).catch(console.log)
        if(!msg || msg.size > 1){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `I cannot find that message in the suggestion channel.`, color: "RED"})
                 
                    message.channel.send(embed)
                    return;
        }
        if(msg.author.id !== message.guild.me.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I am not the author of this message. I cannot edit it.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        let acceptmsg = args.splice(1).join(" ")
        console.log(msg.embeds[0])
        let oldembed = msg.embeds[0]
        if(oldembed == undefined){
            const embed = await MakeEmbed({title: "Permission Denied", description: `This message is not a suggestion.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(oldembed.footer.text == "Accepted" || oldembed.footer.text == "Denied"){
            const embed = await MakeEmbed({title: "Permission Denied", description: `This suggestion has already been accepted/denied.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        console.log(oldembed.description)
        let newembed = await MakeEmbed({author: {name: oldembed.author.name, iconURL: oldembed.author.iconURL}, description: `${oldembed.description}\n\n**Approved**\n**Approved by:** ${message.member}.\n**Reason:** ${acceptmsg}`,color: "00FF1D", footer: {text: "Approved"}, timestamp: Date.now()})
        msg.edit(newembed)
        message.delete();
    }
}