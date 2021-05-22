const HasPermissions = require("../isbypass")
const Discord = require("discord.js")
module.exports = {
    name: "serverinfo",
    description: "shows information for server",
    async execute(message,args,roles){
        let cont = await HasPermissions(roles,message.member)
        console.log(cont)
        if(cont == false && message.member.id != "432345618028036097" && message.channel.id != "818890024178155603"){
            message.reply(`Whoops! Make sure to use this command in <#818890024178155603>.`)
            return;
          } 
          console.log('serverinfo')
       const { guild } = message
       const { name, region, memberCount, owner} = guild
       let userCount = guild.members.cache.filter(
        member => !member.user.bot && member.id != "432345618028036097"
      ).size;
      let botCount = guild.members.cache.filter(member => member.user.bot ).size;
      let frog = guild.members.cache.filter(member => member.id == "432345618028036097").size;
      const rolecount = guild.roles.cache.filter(r => r.name != "@everyone").size
      const channelcount = guild.channels.cache.size
       const icon = guild.iconURL()
       const embed = new Discord.MessageEmbed()
       .setTitle(`Server info for "${name}".`)
       .setThumbnail(icon)
       .setColor("ff00f3")
       .setDescription(`**Owner** - ${owner}\n**Region** - ${region}\n**Member Count** - ${memberCount} (${userCount} Humans, ${botCount} bots, and ${frog} froggo.)\n**Roles** - ${rolecount}\n**Channels** - ${channelcount}`)
     
           .setTimestamp()
           message.channel.send(embed)
    }
}