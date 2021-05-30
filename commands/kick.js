
  const HasPermissions = require("../isbypass")
  const RandomString = require("randomstring")
  const Discord = require("discord.js")
module.exports = {
    name: `kick`,
    description: `kicks members duh`,
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
        if(!mentionmember.kickable){
            return message.reply(`It seems I cannot kick this user.`)
        }
        let reason = message.content.split(" ").splice(2).join(" ")
        console.log(reason)
        if(!reason){
            return message.reply(`I need a reason.`)
        }
        let code = RandomString.generate({
            length: 20,
            charset: 'alphabetic'
          });
        const kickembed = new Discord.MessageEmbed()
        .setDescription(`Successfully kicked ${mentionmember} with the ID of \`${code}\``)
        .setColor("ff00f3")
        
        const dmembed = new Discord.MessageEmbed()
        .setTitle(`You've been kicked from ${message.guild.name}.`)
        .setDescription(`**Reason**\n${reason}\n**ID**\n${code}\nYou can rejoin by clicking [here.](https://discord.gg/Sm9GH4t695)`)
        .setColor("ff00f3")
        .setTimestamp()
        mentionmember.send(dmembed).catch(console.log)
        message.channel.send(kickembed)
        mentionmember.kick(`Kicked by ${message.author.tag} (${message.member.id}) with the ID of ${code} and the reason of ${reason}`)
        const logembed = new Discord.MessageEmbed()
        .setTitle(`New Kick`)
        .setDescription(`**User**\n${mentionmember}\n**Sender**\n${message.member}\n**Reason**\n${reason}\n**ID**\n${code}`)
        .setColor("ff00f3")
        .setTimestamp()
        const logchannel = message.guild.channels.cache.get("825938877327998997")
        logchannel.send(logembed)
    }
}