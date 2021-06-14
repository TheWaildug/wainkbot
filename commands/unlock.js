const HasPermissions = require("../isbypass.js")
const Discord = require("discord.js")
module.exports = {
    name: "unlock",
    description: "unlocks channels",
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
        if(canchat.SEND_MESSAGES == true || canchat.SEND_MESSAGES == null){
          return message.reply(`They already can chat here.`)
        }
        mentionchannel.updateOverwrite(everyone,{SEND_MESSAGES: null},`Unlocked by ${message.author.id} with the reason ${reason}.`)
        const embed = new Discord.MessageEmbed()
        .setTitle(`Channel Unlocked`)
        .setColor("ff00f3")
        .setDescription(`This channel has been unlocked by a staff member.\n\n**Reason:** ${reason}`)
        .setFooter(`Unlocked by ${message.author.tag}`)
        .setTimestamp()
        mentionchannel.send(embed)
    }
}