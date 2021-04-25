const fetch = require("node-fetch")
const RandomString = require("@supercharge/strings")
const Discord = require("discord.js")
const ms = require("ms")
const mutemongo = require("./mutemongo")
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
module.exports = async function(message,reason,time){
    console.log(time)
    console.log(`recieved mute function`)
    let muter = await message.guild.roles.cache.get("826093027545710653")
    if(!muter){
        return message.channel.send(`Uh oh! It seems that I could not find the muted role.`);
    }
    let unmutetime = Date.now() + time;
    message.member.roles.add(muter).catch(e => {
        return message.channel.send(`Something went wrong! \`${e}\``)
    }).then(async () => {
        let id = await setData(message.member.id,time,reason,message.guild.me.id);
        const logembed = new Discord.MessageEmbed()
        .setTitle(`New Mute`)
        .setDescription(`**User**\n${message.member}\n**Sender**\n${message.guild.me}\n**Reason**\n${reason}\n**Length of Mute**\n${ms(time)}\n**ID**\n${id}`)
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
               .setDescription(`${message.member} has been muted for continuous infractions.`)
               .setColor("ff00f3")
              
               message.channel.send(muteembed)
               const dmembed = new Discord.MessageEmbed()
               .setTitle(`You've been muted in ${message.guild.name}.`)
               .setDescription(`**Reason**\n${reason}\n**Time**\n${ms(time,{long: true})}\n**ID**\n${id}`)
               .setColor("ff00f3")
               .setFooter(`User unmute`)
               .setTimestamp(unmutetime)
               message.member.send(dmembed).catch(console.log)
               console.log(logurl)
               const peerams = {
                   "userid": message.member.id,
                   "reason": reason,
                   "logsurl": msg.id,
                   "id": id,
                   "mutetime": time,
                   "moderator": message.guild.me.id
                   }; return fetch(process.env.mute, {method: "POST",
                   headers: {
                    'Content-type': 'application/json'
                   },
                   body: JSON.stringify(peerams)
                   })
        })
    })
}