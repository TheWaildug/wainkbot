const HasPermissions = require("../isbypass")
const Discord = require("discord.js")
async function hasreq(req,test,message){
    return req == test ? message : req != test ? "" : req;
}
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
       const { name, region, owner} = guild
       let memberCount = await guild.members.fetch()
      
       let userCount = memberCount.filter(
        member => !member.user.bot 
      ).size;
      
      let botCount = memberCount.filter(member => member.user.bot ).size;
      const rolecount = guild.roles.cache.filter(r => r.name != "@everyone").size
      const channelcount = guild.channels.cache.size
      
      const icon = guild.iconURL()
      const embed2 = new Discord.MessageEmbed()
      .setTitle(`Server info for ${name}.`)
      .setThumbnail(icon)
      .setColor("ff00f3")
        .addField(`ID`,guild.id)
        .addField(`Owner`,owner)
        .addField(`Description`,guild.description)
        .addField(`Boosts`,`${guild.premiumSubscriptionCount} (Level ${guild.premiumTier})`)
        .addField(`Member Count`,`${memberCount.size} (${userCount} Humans and ${botCount} bots.)`)
        .addField(`Channels`,channelcount)
        .addField(`Roles`,rolecount)
        .addField(`Emojis`,guild.emojis.cache.size)
        .addField(`Server Region`,region)
    .addField(`Features`,guild.features)
      message.channel.send(embed2)
      return;
       
    }
}