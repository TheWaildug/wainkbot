const HasPermissions = require("../isbypass")
const Discord = require("discord.js")
module.exports = {
    name: "membercount",
    description: "Shows current member count in wainked®.",
    permissions: "None.",
    arguments: "None.",
    async execute(message,args,roles){
        let cont = await HasPermissions(roles,message.member)
        console.log(cont)
        if(cont == false && message.member.id != "432345618028036097" && message.channel.id != "818890024178155603"){
            message.reply(`Whoops! Make sure to use this command in <#818890024178155603>.`)
            return;
          } 
          console.log('serverinfo')
       const { guild } = message
       const { name } = guild
       let memberCount = await guild.members.fetch()
       console.log(memberCount.size)
       const embed = new Discord.MessageEmbed()
       .setColor("ff00f3")
       .setTitle(`Member Count`)
       .setDescription(`${name} is currently at **${memberCount.size} members!**`)
     
         
           message.channel.send(embed)
    }
}
