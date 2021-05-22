const Isbypass = require("../isbypass")
module.exports = {
    name: "report",
    description: "reports users maybe?",
    async execute(message,args,roles){
      if(message.member.id != "745325943035396230" && message.member.id != "432345618028036097"){
        return message.reply(`Sorry bro but this isn't in use yet.`)
      }
        let cont = await Isbypass(roles,message.member)
        console.log(cont)
        if(cont == false && message.member.id != "432345618028036097" && message.channel.id != "818890024178155603"){
            message.reply(`Whoops! Make sure to use this command in <#818890024178155603>.`)
            
          } 
          message.member.send(`Who are you reporting? Please reply with their Discord ID.`).then(msg => {
            message.reply(`Check your DMs`)
          }).catch(e => {
              console.log(e)
              message.reply(`I cannot DM you.`)
          })
       
    }
}