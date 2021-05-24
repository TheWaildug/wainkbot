
const Discord = require("discord.js")
const Isbypass = require("../isbypass")

module.exports = {
    name: "report",
    description: "reports users maybe?",
    async execute(message,args,roles,client){
      if(message.member.id != "745325943035396230" && message.member.id != "432345618028036097"){
        return message.reply(`Sorry bro but this isn't in use yet.`)
      }
        let cont = await Isbypass(roles,message.member)
        console.log(cont)
        if(cont == false && message.member.id != "432345618028036097" && message.channel.id != "818890024178155603"){
            message.reply(`Whoops! Make sure to use this command in <#818890024178155603>.`)
            
          } 
          message.member.send(`Who are you reporting? Please reply with their Discord ID. Reply with **Cancel** to cancel this prompt.`).then(async msg => {
            message.reply(`Check your DMs.`)
            const filter =  m => m.author.id == message.author.id
            const collector = msg.channel.createMessageCollector(filter, {time: 30000})
            console.log(collector)
            collector.on("end", async (collected, reason) => {
              console.log(reason)
              if(reason == "time"){
                return msg.channel.send(`Timed out after 30 seconds.`)
              }
            })
  collector.on("collect", async m => {
    if(m.author.bot){
      return;
    }
    console.log(`Collected ${m.content}`)
    collector.stop(`Collected ${m.content}`)
    if(m.content.toLowerCase() == "cancel"){
      console.log(`Cancel`)
      return msg.channel.send(`Cancelled.`);
    }else{
      const user = await client.users.fetch(m.content).catch((e) => {
        
        console.log(e);
       
        return msg.channel.send(`This is not a real user. Please run this command again.`);
      })
      if(user.bot){
        return msg.channel.send(`You cannot report a bot. Please run this command again.`)
      }
      if(user.id == m.author.id){
        return msg.channel.send(`You can't report yourself! Please run this command again.`)
      }
      msg.channel.send(`Why are you reporting **${user.tag}**? Please be as specific as possible. Including links to image sites (imgur, etc.), would be appreciated.`)
      const filter2 = m2 => m2 => m2.author.id == message.author.id
            
            
      const collector1 = msg.channel.createMessageCollector(filter2, {time: 60000})
      collector1.on("end", async (collected, reason) => {
        console.log(reason)
        if(reason == "time"){
          return msg.channel.send(`Timed out after 60 seconds.`)
        }
      })
      collector1.on("collect", async m2 => {
        if(m2.author.bot){
          return;
        }
        console.log(`Collected ${m2.content}`)
    collector1.stop(`Collected ${m2.content}`)
        if(m2.content.toLowerCase() == "cancel"){
          return m2.channel.send(`Cancelled`);
        }
        const server = client.guilds.cache.get("813837609473933312");
        const channel = server.channels.cache.get("828999151001272410")
        let avatar = message.author.displayAvatarURL({format: "png", dynamic: true, size: 128})
        console.log(avatar)
        const embed = new Discord.MessageEmbed()
        .setTitle(`New Report`)
        .setAuthor(message.author.tag,avatar)
        .setColor("ff00f3")
        .setDescription(`Sender: <@${message.author.id}>\nUser being reported: <@${user.id}>\nReason for report: ${m2.content}`)
        .setTimestamp()
        .setFooter(`Reported`)
        channel.send(embed)
        return m2.channel.send(`Your report has been sent.`)
      })
    }
  })
           
          }).catch(e => {
              console.log(e)
              message.reply(`I cannot DM you.`)
          })
       
    }
}