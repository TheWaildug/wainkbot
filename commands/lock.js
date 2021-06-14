const HasPermissions = require("../isbypass.js")
const Discord = require("discord.js")
module.exports = {
    name: "lock",
    description: "locks channels",
    async execute(message,args,roles){
        let cont = await HasPermissions(roles,message.member)
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
        let mentionchannel = message.mentions.channels.first()
        let reason  
    
        if(mentionchannel){
            reason = args.splice(1).join(" ")
        }else{
            console.log(`no mentioned channel.`)
            mentionchannel = message.channel;
            reason = args.join(" ")
        }
        if(!reason){
          return message.reply(`I need a reason.`)
        }
        console.log(mentionchannel.name)
        console.log(reason)
        const everyone = message.guild.roles.everyone
        let canchat = mentionchannel.permissionsFor(everyone).serialize();
        console.log(canchat.SEND_MESSAGES)
        if(canchat.SEND_MESSAGES == false){
          return message.reply(`They already can't chat here.`)
        }
        mentionchannel.updateOverwrite(everyone,{SEND_MESSAGES: false},`Locked by ${message.author.id} with the reason ${reason}.`)
        const embed = new Discord.MessageEmbed()
        .setTitle(`Channel Locked`)
        .setColor("ff00f3")
        .setDescription(`This channel has been locked by a staff member.\n\n**Reason:** ${reason}`)
        .setFooter(`Locked by ${message.author.tag}`)
        .setTimestamp()
        mentionchannel.send(embed)
    }
}