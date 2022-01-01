const RequiredRoles = require("../../values/roles")
RequiredRoles.push("813840097748713482")
const BlockSchema = require("../../blockschema")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: "xd",
    description: "get banned noob",
    requiredRoles: RequiredRoles,
    Category: "Fun",
    expectedArgs: "<user>",
    permissionError: "You must be a Staff Member to run this command.",
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
        const sendembed = await MakeEmbed({title: `You've been banned from **${message.guild.name}**`, description: `**Reason:** xd\n**Moderator:** ${message.member}\n**Action:** Perm-Ban`, color: "RED", timestamp: Date.now()})
        mentionmember.send(sendembed).then(async (sendmsg) => {
            message.channel.send(`${mentionmember} xD get banned noob.`,{allowedMentions: {parse: []}})
            const logembed = await MakeEmbed({title: `New DM Sent`, description: `**User: ** ${mentionmember}\n**Moderator: **${message.member}\n**Command: **xD Command.\n**URL: **${sendmsg.url}`, timestamp: Date.now()})
            log.send(logembed)
        }).catch(e => {
            console.log(e)
            message.reply(`I couldn't ban them noob.`)
        })
    }
}