const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
const snipemongo = require("../../snipemongo")
const HasPermissions = require("../../isbypass")
const ms = require("ms")
module.exports = {
    commands: ["editsnipe","esnipe"],
    description: "Shows the most recent edited message.",
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
        const newmsg = await snipemongo.findOne({channel: message.channel.id, type: "edit"})
      console.log(newmsg)
      if(!newmsg){
        if(!newmsg){
          const embed = await MakeEmbed({description: "I couldn't find anything to snipe!", color: "ff00f3"})
          message.channel.send(embed)
          return message.channel.send(embed)
        }
      }
      if(new Date().getTime() - newmsg.timestamp >= ms("5 minutes") && hasperm == false && message.member.id != "432345618028036097"){
        const embed = await MakeEmbed({description: "I couldn't find anything to snipe!", color: "ff00f3"})
        message.channel.send(embed)
        return console.log(`Past 5 minutes.`)
      }
      let author = await message.client.users.fetch(newmsg.author).catch(async e => {
          console.log(e)
          const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.channel.send(embed) 
        })
        let avatarurl = author.avatarURL({format: "jpg", dynamic: true, size: 512}) || author.defaultAvatarURL;
        let tag = `${author.username}#${author.discriminator}`
        console.log(newmsg.content)
        console.log(author)
        const embed = await MakeEmbed({author: {name: tag, iconURL: avatarurl}, title: `Edit Snipe`, description: `**Before:**\n${newmsg.oldcontent}\n\n**After:**\n${newmsg.content}\n\n**[Jump to Message.](${newmsg.link})**`, color: "ff00f3", footer: {text: "Edited"}, timestamp: Number(newmsg.timestamp)})
        message.channel.send(embed)
    }
}