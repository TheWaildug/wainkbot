const Discord= require("discord.js")
const HasPermissions = require("../isbypass")
const ms = require("ms")
const RandomString = require("randomstring")
const mutedrole = "826093027545710653"
const fetch = require("node-fetch")
const mutemongo = require("../mutemongo")
async function setData(user,time,reason,mod){
    let unmuteti = Date.now() + time
    
    const ne = new mutemongo({
          userid: user,
          mutetime: time,
          reason: reason,
          moderator: mod,
          logsurl: "null",
          ismuted: true,
          unmutetimestamp: unmuteti
        })
        console.log(`New Mute Data: ${user} ${time} ${reason} ${mod}`)
        console.log(ne)
        ne.save()
        return ne._id
  }
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
        if(ismuted != null){
            return message.reply(`This user is already muted!`)
        }
        let muter = await message.guild.roles.cache.get(mutedrole)
        if(!muter){
            return message.reply(`I could not find the muted role`);
        }
        if(mentionmember.roles.cache.has(muter)){
            return message.reply(`This user is already muted!`)
        }
        let time = args[1];
        if(!time){
            return message.reply(`I need a length of time.`)
        }
        let reason = message.content.split(" ").splice(3).join(" ")
        console.log(reason)
        if(!reason){
            return message.reply(`I need a reason.`)
        }
       
        let unmutetime = Date.now() + ms(time)
        mentionmember.roles.add(muter).catch(e => {
            return message.channel.send(`Something went wrong! \`${e}\``)
        }).then(async () => {
            
            let id = RandomString.generate({
                length: 20,
                charset: 'alphabetic'
              });
            await setData(mentionmember.id,ms(time),reason,message.member.id);
            const logembed = new Discord.MessageEmbed()
            .setTitle(`New Mute`)
            .setDescription(`**User**\n${mentionmember}\n**Sender**\n${message.member}\n**Reason**\n${reason}\n**Length of Mute**\n${ms(ms(time))}\n**ID**\n${id}`)
            .setColor("ff00f3")
            .setFooter(`User unmute`)
            .setTimestamp(unmutetime)
            let logurl
            const logchannel = message.guild.channels.cache.get("825938877327998997")
            logchannel.send(logembed).then(msg => {
                logurl = msg.id
                const query = { "_id": id };
                const update = {
                  "$set": {
                    "logsurl": msg.url,
                    
                  }
                  
                };
                const options = { returnNewDocument: true };
                mutemongo.findOneAndUpdate(query, update, options).then(updatedDocumet => {
                if(updatedDocumet) {
                  console.log(`Successfully updated document: ${updatedDocumet}.`)
                } else {
                  console.log("No document matches the provided query.")
                }
                 updatedDocumet
               }).catch(err => console.error(`Failed to find and update document: ${err}`))
               const muteembed = new Discord.MessageEmbed()
               .setDescription(`Successfully muted ${mentionmember} for \`${ms(ms(time,{long: true}))}\` with the id \`${id}\``)
               .setColor("ff00f3")
              
               message.channel.send(muteembed)
               const dmembed = new Discord.MessageEmbed()
               .setTitle(`You've been muted in ${message.guild.name}.`)
               .setDescription(`**Reason**\n${reason}\n**Time**\n${ms(ms(time,{long: true}))}\n**ID**\n${id}`)
               .setColor("ff00f3")
               .setFooter(`User unmute`)
               .setTimestamp(unmutetime)
               mentionmember.send(dmembed).catch(console.log)
               console.log(logurl)
               const peerams = {
                   "userid": mentionmember.id,
                   "reason": reason,
                   "logsurl": msg.url,
                   "id": id,
                   "mutetime": ms(time),
                   "moderator": message.member.id
                   }; return fetch(process.env.mute, {method: "POST",
                   headers: {
                    'Content-type': 'application/json'
                   },
                   body: JSON.stringify(peerams)
                   })
               return;
            })
       
        })
    }
}