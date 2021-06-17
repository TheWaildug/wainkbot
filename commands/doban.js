const Discord = require("discord.js")
const HasPermissions = require("../isbypass")
module.exports = {
    name: "doban",
    description: "It are ban people",
    permissions: "Staff Member.",
    arguments: "!doban (user) (reason)",
    async execute(message,args,roles){
        const cont = await HasPermissions(roles,message.member)
        console.log(cont)
        if(cont == false){
          const embed = new Discord.MessageEmbed()
          .setDescription(`You do not have the correct permissions to run this command.`)
          .setColor("FF0000")
          message.channel.send(embed).then(msg => {
            msg.delete({timeout: 5000})
          })
          return message.delete();
        }
        let mentionmember = message.mentions.members.first()
        if(!mentionmember){
          return message.reply(`Who do I ban?`)
        }
        const reason = args.splice(1).join(" ")
        if(!reason){
          return message.reply(`i need reason for ban.`)
        }
        const dmembed = new Discord.MessageEmbed()
        .setDescription(`you are have ben ban from waink sergver with reason of ${reason} please a peal [here.](https://forms.gle/aZJPVnAhYMAk4AAA6)`)
        .setColor('ff00f3')
        .setTimestamp()
        mentionmember.send(dmembed).catch(e => {
          console.log(e)
        })
        return message.reply(`i are ban this noob.`)
          
    }
}