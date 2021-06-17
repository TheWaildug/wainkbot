const blacklistmongo = require("../blacklistmongo")
const Discord = require("discord.js")
module.exports = {
    name: "status",
    description: "Changes WainkBot's status.",
    permissions: "None.",
    arguments: "!status (status)",
    async execute(message,args,client){
        let isblacklisted = await blacklistmongo.findOne({user: message.member.id, type: "status", blacklisted: true})
        console.log(isblacklisted)
        if(isblacklisted != null){
          return message.reply(`You have been blacklisted from changing my ststus.`)
        }
        let status = message.cleanContent.split(" ").splice(1).join(" ")
        if(!status){
          return message.reply(`I need a status!`)
        }
        if(changestatus == true){
          message.reply(`I have added this status to the pool.`)
        let statusm = new statuses({status: status, user: message.member.id, shuffle: true})
        await statusm.save()
        let allstat = await statuses.find()
        allstatus = allstat
        }else if(changestatus == false){
          await statuses.deleteMany({shuffle: false})
          let statusm = new statuses({status: status, user: message.member.id, shuffle: false})
          await statusm.save()
          const guild = await client.guilds.fetch("781292314856783892")
          const channel = guild.channels.cache.get("840714384044457994")
          const embed = new Discord.MessageEmbed()
          .setTitle(`New Status Change`)
          .setDescription(`User: ${message.member}\nStatus: ${status}`)
          .setTimestamp()
          .setColor(wainkedcolor)
          channel.send(embed)
          if(client.user.id == "832740448909000755"){
            client.user.setPresence({activity: {name: status, type: `WATCHING`}, status: "online"})
          }else{

          
          client.user.setActivity(status, {
            type: "STREAMING",
            url: "https://www.twitch.tv/wainked"
          });
        }
          return message.reply(`go check it out noob.`)
        }
        
    }
}