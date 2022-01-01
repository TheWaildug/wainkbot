const blacklistmongo = require("../../blacklistmongo")
const MakeEmbed = require("../../makeembed")
const statuses = require("../../statuses")
module.exports = {
    commands: ["status","changestatus"],
    description: "Changes WainkBot's status.",
    expectedArgs: "<status>",
    category: "Fun",
    requiredRoles: "@everyone",
    permissionError: "If you see this, something went wrong.",
    minArgs: 1,
    maxArgs: null,
    callback: async (message,args,text) => {
        const isblacklisted = await blacklistmongo.findOne({user: message.member.id, type: "status", blacklisted: true});
        console.log(isblacklisted)
        if(isblacklisted != null){
            const embed = await CreateEmbed({title: "Permission Denied", description: `You have been blacklisted from changing my status.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        
        const status = message.cleanContent.split(" ").splice(1).join(" ")
        await statuses.deleteMany({shuffle: false})
        let statusm = new statuses({status: status, user: message.member.id, shuffle: false});
        await statusm.save()
        const guild = await message.client.guilds.fetch("781292314856783892")
        const channel = guild.channels.cache.get("840714384044457994")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the status log channel.`, color: "RED"})
            message.channel.send(embed)
            
            return;
        }
        const embed = await MakeEmbed({title: "New Status Change", description: `**User:** ${message.member}\n**Status:** ${status}`, color: `ff00f3`, timestamp: Date.now()})
        channel.send(embed)
        if(message.client.user.id == "832740448909000755"){
            message.client.user.setPresence({activity: {name: status, type: `WATCHING`}})
        }else{
            message.client.user.setActivity(status, {
                type: "STREAMING",
                url: "https://www.twitch.tv/wainked"
            })
        }
        return message.reply(`go check it out noob.`)
    }
}