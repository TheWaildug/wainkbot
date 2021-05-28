
  const HasPermissions = require("../isbypass")
  const RandomString = require("@supercharge/strings")
  const Discord = require("discord.js")
module.exports = {
    name: `ban`,
    description: `bans members duh`,
    async execute(message,args,roles){
        let hasperm = await HasPermissions(roles,message.member)
        console.log(hasperm)
        if(hasperm == false){
            const embed = new Discord.MessageEmbed()
            .setDescription(`You do not have the correct permissions to run this command.`)
            .setColor("FF0000")
            message.channel.send(embed).then(msg => {
              msg.delete({timeout: 5000})
            })
            return message.delete();
        }
        if(!args[0]){
            return message.channel.send(`${message.member}, this is not a user.`)
        }
        let mentionmember
        if(message.mentions.members.first()){
            console.log(`there's mentions`)
            mentionmember = message.mentions.members.first()
        }else if(!message.mentions.members.first()){
            console.log(`fetching a user`)
            mentionmember = await message.guild.members.fetch(args[0]).catch(console.log)
        }
        
        if(!mentionmember || mentionmember.size > 1){
            return message.channel.send(`${message.member}, this is not a user.`);
        }
        console.log(mentionmember)
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            return message.reply(`This user has an equal or higher role.`)
        }
        if(!mentionmember.bannable){
            return message.reply(`It seems I cannot ban this user.`)
        }
        let reason = message.content.split(" ").splice(2).join(" ")
        console.log(reason)
        if(!reason){
            return message.reply(`I need a reason.`)
        }
        let code = RandomString.random(20)
        const banembed = new Discord.MessageEmbed()
        .setDescription(`Successfully banned ${mentionmember} with the ID of \`${code}\``)
        .setColor("ff00f3")
        
        const dmembed = new Discord.MessageEmbed()
        .setTitle(`You've been banned from ${message.guild.name}.`)
        .setDescription(`**Reason**\n${reason}\n**ID**\n${code}\n\nYou can appeal this ban by clicking [here](https://docs.google.com/forms/d/e/1FAIpQLScgqdZNwcrqNdfypmUmabOVIw-00NaStK4OD6R_eQAt1tNMhA/viewform)`)
        .setColor("ff00f3")
        .setTimestamp()
        mentionmember.send(dmembed).catch(console.log)
        message.channel.send(banembed)
        mentionmember.ban({reason:`Banned by ${message.author.tag} (${message.member.id}) with the ID of ${code} and the reason of ${reason}`})
        const logembed = new Discord.MessageEmbed()
        .setTitle(`New Ban`)
        .setDescription(`**User**\n${mentionmember}\n**Sender**\n${message.member}\n**Reason**\n${reason}\n**ID**\n${code}`)
        .setColor("ff00f3")
        .setTimestamp()
        const logchannel = message.guild.channels.cache.get("825938877327998997")
        logchannel.send(logembed)
    }
}