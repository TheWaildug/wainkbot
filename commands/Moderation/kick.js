const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
const RandomString = require("randomstring")
module.exports = {
    commands: ["kick","k"],
    description: "Kicks users.",
    expectedArgs: "<user> <reason>",
    requiredRoles: RequiredRoles,
    category: "Moderation",
    permissions: "KICK_MEMBERS",
    permissionError: "You must be a Staff Member to run this command.",
    minArgs: 2,
    maxArgs: null,
    callback: async (message,args) => {
        
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
        message.delete();
        if(mentionmember.user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to kick bots.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.id === message.member.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to kick yourself.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to kick users that have a greater than or equal role to you.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.roles.highest.position >= message.guild.me.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I cannot kick users that have a higher role than me.`, color: "RED"})
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
        const dmembed = await MakeEmbed({title: `You've been kicked from **${message.guild.name}**`,description: `**Moderator**\n<@${message.member.id}>\n**Reason**\n${reason}\n**Case ID**\n${id}`,color: "ff00f3"})
        mentionmember.send({embeds: [dmembed]}).catch(console.log)
       
            await mentionmember.kick(`Kicked by ${message.author.tag}(${message.member.id}) with the ID of ${id}.`).catch(async e =>{
                console.log(e)
                const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.reply({embeds: [embed]})
            return;
            })
        message.channel.send(`<a:checkmark:870842284202164244> ${mentionmember} has been kicked with the ID of \`${id}\`.`,{allowedMentions: {parse: []}})
         const logembed = await MakeEmbed({title: "New Kick", description: `**User:** ${mentionmember}\n**Moderator:** ${message.member}\n**Reason:** ${reason}\n**Case ID:** ${id}`,color: "ff00f3",footer: "Kicked",timestamp: Date.now()})
        channel.send({embeds: [logembed]})
        
    }
}