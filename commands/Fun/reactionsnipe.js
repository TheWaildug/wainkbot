const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
const snipemongo = require("../../snipemongo")
const HasPermissions = require("../../isbypass")
const ms = require("ms")
module.exports = {
    commands: ["reactionsnipe", "rsnipe"],
    description: "Shows the most recent removed reaction.",
    Category: "Fun",
    requiredRoles: "@everyone",
    minArgs: null,
    maxArgs: null,
    expectedArgs: [],
    permissionError: `If you can see this, something went wrong.`,
    callback: async (message,args) => {
        let hasperm = await HasPermissions(RequiredRoles,message.member)
        console.log(hasperm)
        if(message.channel.id == "830510753155907584" || message.channel.id == "830510970673168434" && message.member.id != "432345618028036097"){
          return;
        }
        const newmsg = await snipemongo.findOne({channel: message.channel.id, type: "reaction"})
      console.log(newmsg)
      if(!newmsg){
        const embed = await MakeEmbed({description: "I couldn't find anything to snipe!", color: "ff00f3"})
        return message.reply({embeds: [embed]})
      }
      if(new Date().getTime() - newmsg.timestamp >= ms("5 minutes") && hasperm == false && message.member.id != "432345618028036097"){
        const embed = await MakeEmbed({description: "I couldn't find anything to snipe!", color: "ff00f3"})
        message.reply({embeds: [embed]})
        return console.log(`Past 5 minutes.`)
      }
      await message.client.users.fetch(newmsg.author.join("")).then(async author => {
        let avatarurl = author.avatarURL({format: "jpg", dynamic: true, size: 512}) || author.defaultAvatarURL;
        let tag = `${author.username}#${author.discriminator}`
        console.log(newmsg)
        console.log(author)
        const embed = await MakeEmbed({author: {name: tag, iconURL: avatarurl}, title: `Reaction Snipe`, description: `**Emoji:**\n${newmsg.content}\n\n**[Jump to Message.](${newmsg.link})**`, color: "ff00f3", footer: {text: "Removed"}, timestamp: Number(newmsg.timestamp)})
        message.reply({embeds: [embed]})
      }).catch(async e => {
          console.log(e)
          const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.reply({embeds: [embed]}) 
        })
       
    }
}