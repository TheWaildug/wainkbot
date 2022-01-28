const blacklistMongo = require("../../blacklistmongo")
const MakeEmbed = CreateEmbed = require("../../makeembed")
const roles = require("../../values/roles")
const HasPermission = require("../../isbypass")
module.exports = {
    commands: ["report"],
    description: "Reports any user.",
    requiredRoles: "@everyone",
    expectedArgs: [],
    Category: "Utility",
    permissonError: "If you can see this, something went wrong.",
    minArgs: null,
    maxArgs: null,
    callback: async (message,args) => {
        const {client} = message
        const cont = await HasPermission(roles,message.member)
        if(cont == false && message.channel.id != "818890024178155603" && message.channel.id != "832040924267806750"){
            const embed = await CreateEmbed({title: "Permissions Error", description: `Whoops! Make sure to use this command in <#818890024178155603>.`, color: "RED"})
                 message.channel.send({embeds: [embed]})
                 message.delete()
                 return;
        }
        const isblacklisted = await blacklistMongo.findOne({user: message.member.id, type: "report", blacklisted: true});
        console.log(isblacklisted)
        if(isblacklisted != null){
            const embed = await CreateEmbed({title: "Permission Denied", description: `You have been blacklisted from making reports.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const dmembed = await CreateEmbed({title: "Reports", description: "Who are you reporting? Please reply with their Discord ID. Reply with **cancel** to cancel this prompt.", color: "ff00f3"})
        message.member.send({embeds: [dmembed]}).then(async msg => {
            message.reply(`Check your DMs.`)
            const filter =  m => m.author.id == message.author.id
            const collector = msg.channel.createMessageCollector({filter,time: 30 * 1000})
          
            collector.on("end", async (collected, reason) => {
              console.log(reason)
              if(reason == "time"){
                const timeoutembed = await MakeEmbed({title: "Reports", description: "Timed out after 30 seconds.", color: "ff00f3"})
                return msg.reply({embeds: [timeoutembed]})
              }
            })

  collector.on("collect", async m => {
    if(m.author.bot){
      return;
    }
    console.log(`Collected ${m.content}`)
    collector.stop(`Collected ${m.content}`)
    if(m.content.toLowerCase() == "cancel"){
      console.log(`Cancel`)
      const embed = await MakeEmbed({title: "Reports", description: "Promt cancelled.", color: "ff00f3"})
      m.reply({embeds: [embed]})
      return;
    }else{
      await client.users.fetch(m.content).then(async user => {
        
        if(!user || user.size > 1){
            const embed = await MakeEmbed({title: "Unknown Member", description: `\`${m.content}\` is not a real member.`, color: "RED"})
                 
            m.reply({embeds: [embed]})
            return; 
        }
        if(user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to report bots.`, color: "RED"})
            m.reply({embeds: [embed]})
            return;
        }
        if(user.id == m.author.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to report yourself.`, color: "RED"})
            m.reply({embeds: [embed]})
            return;
        }
        const dmembed = await CreateEmbed({title: "Reports", description: `Why are you reporting **${user.tag}**? Please be as specific as possible. Including links to image sites (imgur, etc) would be appreciated. Uploading images will not work.`, color: "ff00f3"})
        let newem = await msg.channel.send({embeds: [dmembed]})  
        const filter2 = m2 => m2.author.id == message.author.id
        const collector1 = msg.channel.createMessageCollector({filter2,time: 30 * 1000})
        collector1.on("end", async (collected, reason) => {
          console.log(reason)
          if(reason == "time"){
            const timeoutembed = await MakeEmbed({title: "Reports", description: "Timed out after 30 seconds.", color: "ff00f3"})
            return newem.reply({embeds: [timeoutembed]})
          }
        })
        collector1.on("collect", async m2 => {
          if(m2.author.bot){
            return;
          }
          console.log(`Collected ${m2.content}`)
      collector1.stop(`Collected ${m2.content}`)
          if(m2.content.toLowerCase() == "cancel"){
            const embed = await MakeEmbed({title: "Reports", description: "Promt cancelled.", color: "ff00f3"})
            return m2.reply({content: [embed]})
          }
          const server = client.guilds.cache.get("813837609473933312");
          const channel = server.channels.cache.get("828999151001272410")
          let avatar = message.author.displayAvatarURL({format: "png", dynamic: true, size: 128})
          console.log(avatar)
          const embed = await MakeEmbed({title: "New Report", author: {name: message.author.tag, iconURL: avatar}, color: "ff00f3", description: `**Sender:** ${message.author}\n**User being reported:** <@${user.id}>\n**Reason for report:** ${m2.content}`,footer: {text: "Reported"}, timestamp: Date.now()})
          channel.send({embeds: [embed]})
          const dmembed = await MakeEmbed({title: "Reports", description: "Your report has been sent.",color: "ff00f3"})
          return m2.reply({embeds: [dmembed]})
        })
      }).catch(async (e) => {
        
        console.log(e);
        const embed = await MakeEmbed({title: "Unknown Member", description: `\`${m.content}\` is not a real member.`, color: "RED"})
                 
        m.reply({embeds: [embed]})
        return;
      })
    }
  })
           
          }).catch(async e => {
              console.log(e)
              const embed = await MakeEmbed({title: "Error", description: "Your DMs need to be opened. Please open them and run this command again.", color: "RED"})
              message.channel.send(embed)
        })
    }
}