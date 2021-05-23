
const { DiscordAPIError } = require("discord.js")
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
            message.reply(`Check your DMs`)
            const filter = m => !m.author.bot && m.author.id == msg.author.id && [m.content.toLowerCase() == "cancel" || !m.content.toLowerCase() == "cancel"]
            
            const dmmsg = await HandleCollector(filter,msg)
            const collector = msg.channel.createMessageCollector(filter, {time: 20000})
            collector.on("end", async (collected, reason) => {
              console.log(reason)
              if(reason == "time"){
                return msg.channel.send(`Timed out after 20 seconds.`)
              }
            })
  collector.on("collect", async m => {
    console.log(`Collected ${m.content}`)
    collector.stop(`Collected ${m.contet}`)
    if(m.content.toLowerCase() == "cancel"){
      return msg.channel.send(`Cancelled.`);
    }else{
      const user = await client.users.fetch(m.content).catch((e) => {
        
        console.log(e);
       
        msg.channel.send(`This is not a real user. Please run this command again.`)
      })
      if(user.bot){
        return msg.channel.send(`You cannot report a bot. Please run this command again.`)
      }
      msg.channel.send(`Why are you reporting this user? Please be as specific as possible. Including links to image sites (imgur, etc.), would be appreciated.`)

    }
  })
           
          }).catch(e => {
              console.log(e)
              message.reply(`I cannot DM you.`)
          })
       
    }
}