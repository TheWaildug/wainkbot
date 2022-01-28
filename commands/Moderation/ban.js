const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
const RandomString = require("randomstring")
module.exports = {
    commands: ["ban","b","banish"],
    description: "Bans users that are in the guild.",
    expectedArgs: "<user> <reason>",
    requiredRoles: RequiredRoles,
    Category: "Moderation",
    permissionError: "You must be a Staff Member to run this command.",
    minArgs: 2,
    maxArgs: null,
    callback: async (message,args) => {
        message.delete();
        let mentionmember
        if(message.mentions.members.first()){
            mentionmember = message.mentions.members.first()
          
        }else{
            mentionmember = await message.guild.members.fetch(args[0]).catch(e => {
                console.log(e)
            })    
        }   
        if(!mentionmember || mentionmember.size > 1){
            const embed = await MakeEmbed({title: "Unknown Member", description: `\`${args[0]}\` is not a member.`, color: "RED"})
                 
            message.reply({embeds: [embed]})
            return;
        }
        
        if(mentionmember.user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to ban bots.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.id === message.member.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to ban yourself.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to ban users that have a greater than or equal role to you.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.roles.highest.position >= message.guild.me.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I cannot ban users that have a higher role than me.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const reason = args.splice(1).join(" ")
        console.log(reason)
        const id = message.id
        
        const channel = message.guild.channels.cache.get("825938877327998997")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the logs channel.`, color: "RED"})
            message.reply({embeds: [embed]})
            
            return;
        }
        
            await mentionmember.ban({reason: `Banned by ${message.author.tag}(${message.member.id}) with the reason of "${reason}" and ID of ${id}.`}).catch(async e =>{
                console.log(e)
                const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.reply({embeds: [embed]})
            return;
            })
        
        message.channel.send({content: `<a:checkmark:870842284202164244> ${mentionmember} has been banned with the ID of \`${id}\`.`,allowedMentions: {parse: []}})
        
        const dmembed = await MakeEmbed({title: `You've been banned from **${message.guild.name}**`,description: `**Moderator**\n<@${message.member.id}>\n**Reason**\n${reason}\n**Case ID**\n${id}\n\nYou can appeal this ban by clicking [here](https://docs.google.com/forms/d/e/1FAIpQLScgqdZNwcrqNdfypmUmabOVIw-00NaStK4OD6R_eQAt1tNMhA/viewform)`,color: "ff00f3"})
        mentionmember.send({embeds: [dmembed]}).catch(console.log)
        const logembed = await MakeEmbed({title: "New Ban", description: `**User:** ${mentionmember}\n**Moderator:** ${message.member}\n**Reason:** ${reason}\n**Case ID:** ${id}`,color: "ff00f3",footer: "Banned",timestamp: Date.now()})
        channel.send({embeds: [logembed]})
        
    }
}