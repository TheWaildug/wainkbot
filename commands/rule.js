const Discord = require("discord.js")
const HasPermissions = require("../isbypass")
const rules = require("../values/rules")
module.exports = {
    name: "rule",
    description: "Shows a certain rule.",
    permissions: "Staff Member.",
    arguments: "!rule (rule number)",
    async execute(message,args,roles){
        let cont = await HasPermissions(roles,message.member)
        console.log(cont)
         if(cont == false && message.member.id != "432345618028036097"){
           const embed = new Discord.MessageEmbed()
           .setDescription(`You do not have the correct permissions to run this command.`)
           .setColor("FF0000")
           message.channel.send(embed).then(msg => {
             msg.delete({timeout: 5000})
           })
           return message.delete();
         }
         const rule = args[0]
         let tablerule = Number(args[0]) - 1
         if(tablerule > rules.length - 1){
           return message.reply(`This is not a rule!`)
         }
         if(tablerule < 0){
           return message.reply(`This is not a rule!`)
         }
         let getrule = rules[tablerule]
         const embed = new Discord.MessageEmbed()
         .setTitle(`Rule #**${rule}**`)
         .setDescription(getrule)
         .setColor("ff00f3")
         message.channel.send(embed)
    }
}