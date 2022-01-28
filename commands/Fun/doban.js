const RequiredRoles = require("../../values/roles")
const BlockSchema = require("../../blockschema")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: "doban",
    description: "It are bans people ok?",
    requiredRoles: RequiredRoles,
    Category: "Fun",
    expectedArgs: "<user> <reason>",
    permissionError: "You must be a Staff Member to run this command.",
    minArgs: 2,
    maxArgs: null,
    callback: async (message,args) => {
        const mentionmember = message.mentions.members.first();
        if(!mentionmember){
            const embed = await MakeEmbed({title: "Unknown Member", description: `\`${args[0]}\` is not a member.`, color: "RED"})
                 
            message.reply({embeds: [embed]})
            return;
        }
        const isblocked = await BlockSchema.findOne({user: mentionmember.id, type: "dm"})
        if(isblocked != null){
            const embed = await MakeEmbed({title: "Permission Denied", description: `This user has opted out of DMs.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const log = message.client.channels.cache.get("862715876633739304")
        if(!log){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the DM log channel.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        
        const reason = args.slice(1).join(" ")
        const dmembed = await MakeEmbed({description: `you are have ben ban from wainjked serger with reason of ${reason} please a peal [here.](https://forms.gle/aZJPVnAhYMAk4AAA6)`,color: `ff00f3`,timestamp: Date.now()})
        mentionmember.send({embeds: [dmembed]}).then(async (sendmsg) => {
            message.channel.send({content: `i are ban this noob`,allowedMentions: {parse: []}})
            const logembed = await MakeEmbed({title: `New DM Sent`, description: `**User: ** ${mentionmember}\n**Moderator: **${message.member}\n**Command: **doban Command.\n**URL: **${sendmsg.url}`, timestamp: Date.now()})
            log.send({embeds: [logembed]})
        }).catch(e => {
            console.log(e)
            message.reply(`I are not ban them noob.`)
        })
    }
}