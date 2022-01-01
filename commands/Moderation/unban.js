const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
const GetPing = require("../../getPing")
module.exports = {
    commands: ["unban","ub","unbanish"],
    description: "Unbans users that are banned.",
    expectedArgs: "<user> <reason>",
    requiredRoles: RequiredRoles,
    Category: "Moderation",
    permissionError: "You must be a Staff Member to run this command.",
    minArgs: 2,
    maxArgs: null,
    callback: async (message,args,text,prefix,alias) => {
        let mentionmember = await GetPing(args[0])
    
        const ban = message.guild.fetchBan(mentionmember).catch(async e => {
            
        })
        if(!ban){
            const embed = await MakeEmbed({title: `Unknown Ban`, description: `I cannot see a ban listed for the user \`${args[0]}\`. Mentioning them will not work.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        let reason = message.content.split(" ").splice(2).join(" ")
        console.log(reason)
        let id = message.id
        const channel = message.guild.channels.cache.get("825938877327998997")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the logs channel.`, color: "RED"})
            message.channel.send(embed)
            
            return;
        }
        await message.guild.members.unban(mentionmember,`Unbanned by ${message.author.tag}(${message.member.id}) with the reason of "${reason}" and ID of ${id}.`).then(async ()=> {
            message.channel.send(`<a:checkmark:870842284202164244> <@${mentionmember}> has been unbanned with the ID of \`${id}\`.`,{allowedMentions: {parse: []}})
            const logembed = await MakeEmbed({title: "New Unban", description: `**User:** <@${mentionmember}>\n**Moderator:** ${message.member}\n**Reason:** ${reason}\n**Case ID:** ${id}`,color: "ff00f3",footer: "Unbanned",timestamp: Date.now()})
            channel.send(logembed)
        }).catch(async e => {
            
            const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
        message.channel.send(embed)
        return;
        })
       
    }
}