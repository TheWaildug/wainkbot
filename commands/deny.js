let channelid = "828999520120733777"
const Discord = require("discord.js")
module.exports = {
    name: "deny",
    descripion: "denies things",
   async execute(message,args,roles){
       if(!message.member.roles.cache.has("833021553935122432")){

            const embed = new Discord.MessageEmbed()
            .setDescription(`You do not have the correct permissions to run this command.`)
            .setColor("FF0000")
            message.channel.send(embed).then(msg => {
              msg.delete({timeout: 5000})
            })
            return message.delete();
        }
        if(message.channel.id != "828999520120733777" && message.channel.id != "816862529564573746" && message.channel.id != "832040924267806750"){
            return message.reply(`Please run this in the staff channel or suggestions channel.`)
        }
        if(isNaN(args[0]) || !args[0]){
            return message.reply(`I need a message ID.`);
        }
        
        let channel = message.guild.channels.cache.get(channelid)
        let msg = await channel.messages.fetch(args[0]).catch(e => console.log(`${e}`))
        if(!msg || msg.size > 1){
            return message.reply(`This is not a message!`)
        }
        if(msg.author.id != message.guild.me.id){
            return message.reply(`I am not the author of this message! I cannot edit it.`);
        }
        console.log(msg.embeds[0])
        let oldembed = msg.embeds[0]
        if(oldembed == undefined){
            return message.reply(`This isn't a suggestion!`)
        }
        let acceptmsg = args.splice(1).join(" ")
        if(acceptmsg == ""){
            return message.reply(`I need a reason.`);
        }
        
        if(oldembed.footer.text == "Accepted" || oldembed.footer.text == "Denied"){
            return message.reply(`This suggestion has already been accepted/denied.`)
        }
        console.log(oldembed.description)
        let newembed = new Discord.MessageEmbed()
        .setAuthor(oldembed.author.name,oldembed.author.iconURL)
        .setDescription(`${oldembed.description}\n**Denied:**\nDenied by ${message.member}.\nReason: ${acceptmsg}`)
        .setColor("FF0000")
        .setFooter(`Denied`)
        .setTimestamp()
        msg.edit(newembed)
        message.react("👍")
    }
}