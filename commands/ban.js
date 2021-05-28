const HasPermissions = require("../isbypass")
const Discord = require("discord.js")
module.exports = {
    name: "ban",
    description: "bans bad bois",
    async execute(message,args,roles,client){
      
        let hasperm = await HasPermissions(roles,message.member)
        console.log(hasperm)
        if(hasperm == false){
            const embed = new Discord.MessageEmbed()
            .setDescription(`You do not have the correct permissions to run this command.`)
            .setColor("FF0000")
            message.channel.send(embed).then(msg => {
              msg.delete({timeout: 5000})
            })
            return message.delete();
        }
        if(client.user.id != "832740448909000755"){
            return message.reply(`The ban command isn't in use yet.`)
        }
        let mentionmember
        if(message.mentions.members.first()){
            mentionmember = message.mentions.members.first()
        }else if(!message.mentions.members.first()){
            mentionmember = await message.guild.members.fetch(args[0]).catch(e => {
                console.log(e)
            })
        }   
        if(!mentionmember || mentionmember.size > 1){
            return message.reply(`You must specify someone to ban.`);
        }
        let reason = message.content.split(" ").splice(2).join(" ")
        if(!reason){
            return message.reply(`I need a reason.`)
        }
        
        if(message.member.id == mentionmember.id){
            return message.reply(`You cannot ban yourself!`)
        }
        const cannotbebanned = await HasPermissions(roles,mentionmember)
        console.log(cannotbebanned)
        if(cannotbebanned == true && !message.member.roles.cache.has("819048048105357382")){
            return message.reply(`This user has a whitelisted role.`)
        }
        console.log(mentionmember.roles.highest.position >= message.member.roles.highest.position && !message.member.roles.cache.has("819048048105357382"))
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            return message.reply(`This user has a role that is greater than or equal to your highest role.`)
        }
        if(message.member.id == "432345618028036097"){
            return message.reply(`lol you can't ban the froggo.`)
        }
        mentionmember.ban(`Banned by ${message.author.tag} with the reason ${reason}`).catch(e => {
            console.log(e)
            return message.reply(`Something went wrong!`)
        })
    }
}