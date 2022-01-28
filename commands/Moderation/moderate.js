const MakeEmbed = require("../../makeembed")
const RandomString = require("randomstring")
const RequiredRoles = require("../../values/roles")
const { DataResolver } = require("discord.js")
module.exports = {
    commands: ["moderate","mod"],
    description: "Moderates a user's nickname.",
    requiredRoles: RequiredRoles,
    expectedArgs: "<user>",
    minArgs: 1,
    permissionError: "You must be a Staff Member to run this command.",
    maxArgs: null,
    Category: "Moderation",
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
        
       
        if(mentionmember.user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to moderate bots.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.id === message.member.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to moderate yourself.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to moderate users that have a greater than or equal role to you.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(mentionmember.roles.highest.position >= message.guild.me.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I cannot moderate users that have a higher role than me.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.id == message.guild.ownerId){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I cannot moderate the owner of this server.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const channel = message.guild.channels.cache.get("825938877327998997")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the logs channel.`, color: "RED"})
            message.reply({embeds: [embed]})
            
            return;
        }
        const newnick = RandomString.generate({
            length: 7,
            charset: 'alphabetic'
          });
          console.log(newnick)
          const id = message.id
        mentionmember.setNickname(`Moderated Nickname ${newnick}`,`Moderated by ${message.author.tag}(${message.author.id}) with the ID of ${id}`).catch(async e => {
            console.log(e)
                const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        })
        message.channel.send(`<a:checkmark:870842284202164244> Moderated nickname to \`Moderated Nickname ${newnick}\``)
        const dmembed = await MakeEmbed({title: `Your nickname has been moderated in **${message.guild.name}**`,color: "ff00f3",description: `**Moderator:** ${message.member}\n**Case ID:** ${id}\n\nYour nickname was moderated because it went against our rules.`, timestamp: Date.now()})
        mentionmember.send({embeds: [dmembed]}).catch(console.log)
        const logembed = await MakeEmbed({title: "New Moderated Nickname", description: `**User:** ${mentionmember}\n**Moderator:** ${message.member}\n**Case ID:** ${id}`,color: "ff00f3",timestamp: Date.now()})
        channel.send({embeds: [logembed]})
    }
}