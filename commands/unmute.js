const Discord= require("discord.js")
const HasPermissions = require("../isbypass")
const ms = require("ms")
const RandomString = require("randomstring")
const mutedrole = "826093027545710653"
const fetch = require("node-fetch")
const mutemongo = require("../mutemongo")

module.exports = {
    name: "mute",
    description: "mutes people",
    async execute(message,args,roles){
        
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
        if(message.member.id != "432345618028036097"){
            return message.reply(`You can't unmute yet idiot.`)
        }
        if(!args[0]){
            return message.channel.send(`${message.member}, this is not a user.`)
        }
        let mentionmember
        if(message.mentions.members.first()){
            console.log(`there's mentions`)
            mentionmember = message.mentions.members.first()
        }else if(!message.mentions.members.first()){
            console.log(`fetching a user`)
            mentionmember = await message.guild.members.fetch(args[0]).catch(console.log)
        }
        
        if(!mentionmember || mentionmember.size > 1){
            return message.channel.send(`${message.member}, this is not a user.`);
        }
        console.log(mentionmember)
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            return message.reply(`This user has an equal or higher role.`)
        }
        let ismuted = await mutemongo.findOne({userid: mentionmember.id, ismuted: true})
        console.log(ismuted)
        if(ismuted == null){
            return message.reply(`This user is not muted!`)
        }
        let muter = await message.guild.roles.cache.get(mutedrole)
        if(!muter){
            return message.reply(`I could not find the muted role`);
        }
        if(!mentionmember.roles.cache.has(muter)){
            return message.reply(`This user is not muted!`)
        }

        let reason = message.content.split(" ").splice(2).join(" ")
        console.log(reason)
        if(!reason){
            return message.reply(`I need a reason.`)
        }
       
       
        
            
           
               const logsurl = logchannel.logsurl
               const muteembed = new Discord.MessageEmbed()
               .setDescription(`Successfully unmuted ${mentionmember}.`)
               .setColor("ff00f3")
              
               message.channel.send(muteembed)
               console.log(logurl)
               const peerams = {
                   "userid": mentionmember.id,
                   "reason": reason,
                   "logsurl": msg.url,
                   "moderator": message.member.id
                   }; return fetch(process.env.unmute, {method: "POST",
                   headers: {
                    'Content-type': 'application/json'
                   },
                   body: JSON.stringify(peerams)
                   })
               return;
       
    }
}