const RequiredRoles = require("../../values/roles")
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
                 
            message.channel.send(embed)
            return;
        }
        const reason = args.slice(1).join(" ")
        const dmembed = await MakeEmbed({description: `you are have ben ban from wainjked serger with reason of ${reason} please a peal [here.](https://forms.gle/aZJPVnAhYMAk4AAA6)`,color: `ff00f3`,timestamp: Date.now()})
        mentionmember.send(dmembed).catch(e => {
            console.log(e)
        })
        return message.reply(`i are ban this noob`)
    }
}