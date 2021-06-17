const Discord = require("discord.js")
const HasPermissions = require("../isbypass")
module.exports = {
    name: "say",
    description: "Makes WainkBot say something.",
    permissions: "Staff Member.",
    arguments: "!say (message)",
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
        let mentionchannel
        let switchargs = false
        if(message.mentions.channels.first()){
          mentionchannel = message.mentions.channels.first()
        }else if(!isNaN(args[0])){
          mentionchannel = message.guild.channels.cache.get(args[0])
        }else{
          mentionchannel = message.channel
          switchargs = true
        }
        if(!mentionchannel){
          switchargs = true
          mentionchannel = message.channel
        }
        if(mentionchannel.id == "830510753155907584"){
          return message.reply(`You know the **!chain** command exists right?`)
        }
        console.log(mentionchannel.name)
        let msg = ""
        if(switchargs == false){
          msg = args.splice(1).join(" ")
        }else if(switchargs == true){
          msg = args.join(" ")
        }
        console.log(msg)
        if(msg == ""){
          return message.reply(`I can't say nothing!`)
        }
        mentionchannel.send(msg).catch(e => {return message.reply(`${e}`)})
        message.delete()
    }
}