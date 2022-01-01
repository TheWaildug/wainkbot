const MakeEmbed = require("../../makeembed")
const BlockSchema = require("../../blockschema")
module.exports = {
    commands: ["dm"],
    description: `DMs users.`,
    requiredRoles: "832747239809613834",
    expectedArgs: "<user> <message>",
    minArgs: 2,
    maxArgs: null,
    permissionError: `You cannot run this command.`,
    Category: `Utility`,
    callback: async (message,args,text,prefix) => {
        const mentionmember = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(console.log)
        if(!mentionmember || mentionmember.size > 1){
            const embed = await MakeEmbed({title: "Unknown Member", description: `\`${args[0]}\` is not a member.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(mentionmember.user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to DM bots.`, color: "RED"})
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
        const msg = args.splice(1).join(" ")
        console.log(msg)
        //const dmembed = await MakeEmbed({title: `New DM!`, description: `New DM from **${message.member}**.\n\n**Message:** ${msg}`, timestamp: Date.now(), color: "ff00f3", footer: {text: `You can opt out of DMs via ${prefix}blockdm <enable/disable/view>`}})
        mentionmember.send(msg).then(async (sendmsg) => {
            message.channel.send(`${mentionmember} get dmed noob.`,{allowedMentions: {parse: []}})
            const logembed = await MakeEmbed({title: `New DM Sent`, description: `**User: ** ${mentionmember}\n**Moderator: **${message.member}\n**Message: **${msg}\n**URL: **${sendmsg.url}`, timestamp: Date.now()})
            log.send(logembed)
        }).catch(e => {
            console.log(e)
            message.reply(`I couldn't DM them noob.`)
        })
    }
}
    