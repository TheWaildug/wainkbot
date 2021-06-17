const snipemongo = require("../snipemongo")
const HasPermissions = require("../isbypass")
const Discord = require("discord.js")
const ms = require("ms")
module.exports = {
    name: "snipe",
    description: "Shows the most recent deleted message.",
    permissions: "None.",
    arguments: "None.",
    async execute(message,args,roles,client){
        console.log(`snipe`)
        let hasperm = await HasPermissions(roles,message.member)
        console.log(hasperm)
        if(message.channel.id == "830510753155907584" || message.channel.id == "830510970673168434" && message.member.id != "432345618028036097"){
          return;
        }
        const newmsg = await snipemongo.findOne({channel: message.channel.id, type: "delete"})
      console.log(newmsg)
        if(!newmsg){
          return message.channel.send(`I couldn't find anthing to snipe.`)
        }
        if(new Date().getTime() - newmsg.timestamp >= ms("5 minutes") && hasperm == false && message.member.id != "432345618028036097"){
          const embed = new Discord.MessageEmbed()
          .setDescription(`I couldn't find anything to snipe!`)
          .setColor(wainkedcolor)
          message.channel.send(embed)
          return console.log(`Past 5 minutes.`)
        }
        let author = await client.users.fetch(newmsg.author).catch((e) => {console.log(e); return message.channel.send(`Something went wrong! \`${e}\``)})
        let avatarurl = author.avatarURL({format: "jpg", dynamic: true, size: 512}) || author.defaultAvatarURL
        let tag = `${author.username}#${author.discriminator}`
        console.log(newmsg.content)
        console.log(author)
        const embed = new Discord.MessageEmbed()
        .setAuthor(tag,avatarurl)
        .setDescription(`${newmsg.content}`)
        .setColor("ff00f3") 
        .setFooter(`Deleted`)
        .setTimestamp(Number(newmsg.timestamp))
        message.channel.send(embed)
    }
}