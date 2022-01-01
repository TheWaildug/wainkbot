const BlockSchema = require("../../blockschema")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: "noob",
    description: "get restricted noob",
    requiredRoles: "846099942736265217",
    Category: "Fun",
    expectedArgs: "<user>",
    permissionError: "lol no.",
    minArgs: 1,
    maxArgs: null,
    callback: async (message,args) => {
        const mentionmember = message.mentions.members.first();
        if(!mentionmember){
            const embed = await MakeEmbed({title: "Unknown Member", description: `\`${args[0]}\` is not a member.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        const isblocked = await BlockSchema.findOne({user: mentionmember.id, type: "dm"})
        if(isblocked != null){
            const embed = await MakeEmbed({title: "Permission Denied", description: `This user has opted out of DMs.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        const log = message.client.channels.cache.get("862715876633739304")
        if(!log){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the dm log channel.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        const dmembed = await MakeEmbed({title: `You've been restricted in **${message.guild.name}**`,description: `\n**Moderator*\n*${message.member}\n**Reason**\nBig Noob\n\nYou can appeal this ban by joining this server [ht឵tps://disc឵ord.gg/dkY឵mpNM2Uh](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`,color: "ff00f3"})
        mentionmember.send(dmembed).then(async (sendmsg) => {
            message.channel.send(`ok.`,{allowedMentions: {parse: []}})
            const logembed = await MakeEmbed({title: `New DM Sent`, description: `**User: ** ${mentionmember}\n**Moderator: **${message.member}\n**Command: **Noob Command.\n**URL: **${sendmsg.url}`, timestamp: Date.now()})
            log.send(logembed)
        }).catch(e => {
            console.log(e)
            message.reply(`just no.`)
        })
    }
}