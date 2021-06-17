const HasPermissions = require("../isbypass.js")
const Discord = require("discord.js")
module.exports = {
    name: [`purge`,`prune`,`sweep`],
    description: "Purges certain amount of messages.",
    permissions: "Staff Member.",
    arguments: "!purge (user) (amount) or !purge (amount)",
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
        let contin = true
        let mentionmember = message.mentions.members.first()
        if(!mentionmember){
            contin = false
        }
        if(contin == true){
            args[0] = args[1]
        }
        if(isNaN(args[0])){
            return message.reply(`This isn't a number`);
        }
        if(Number(args[0]) <= 0){
            return message.reply(`I need a number greater than 0.`);
        }
        if(Number(args[0]) >= 100){
            return message.reply(`You cannot purge more than 100 messages.`)
        }
    
        console.log(args[0])
        
        let messages = await message.channel.messages.fetch();
        if(!messages){
            return message.reply(`There isn't anything to purge.`);
        }
        if(contin == true){
            messages = messages.filter(m => m.author.id == mentionmember.id)
            let newmsg = []
            let msgsize = 0
            messages.forEach(msg => {
                if(msgsize > args[0]){
                    return;
                }
                newmsg.push(msg);
                msgsize++
            })
            messages = newmsg
        }else{
            let newmsg = []
            let msgsize = 0
            messages.forEach(msg => {
                if(msgsize > args[0]){
                    return;
                }
                newmsg.push(msg);
                msgsize++
            })
            messages = newmsg
        }
        if(!messages){
            return message.reply(`There isn't anything to purge.`);
        }
        message.channel.bulkDelete(messages).catch(e => {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Error`)
            .setColor(`RED`)
            .setDescription(e)
            message.channel.send(embed)
            message.delete();
            return;
        }).then(() => {
            message.delete().catch(console.log)
            return;
        })
    }
}