let channelid = "828999151001272410"
const Discord = require("discord.js")
module.exports = {
    name: "raccept",
    description: "Accepts reports in <#828999151001272410>",
    permissions: "<@&813840097166360577>.",
    arguments: "!raccept (messageID) (reason)",
   async execute(message,args,roles){
       if(!message.member.roles.cache.has("813840097166360577")){

            const embed = new Discord.MessageEmbed()
            .setDescription(`You do not have the correct permissions to run this command.`)
            .setColor("FF0000")
            message.channel.send(embed).then(msg => {
              msg.delete({timeout: 5000})
            })
            return message.delete();
        }
        if(message.channel.id != "828999151001272410" && message.channel.id != "816862529564573746" && message.channel.id != "832040924267806750"){
            return message.reply(`Please run this in the staff channel or report channel.`)
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
            return message.reply(`This isn't a report!`)
        }
        
        let acceptmsg = args.splice(1).join(" ")
        if(acceptmsg == ""){
            return message.reply(`I need a reason.`);
        }
        
        if(oldembed.footer.text == "Accepted" || oldembed.footer.text == "Denied"){
            return message.reply(`This report has already been accepted/denied.`)
        }
        console.log(oldembed.description)
        let newembed = new Discord.MessageEmbed()
        .setAuthor(oldembed.author.name,oldembed.author.iconURL)
        .setDescription(`${oldembed.description}\n**Approved:**\nApproved by ${message.member}.\nReason: ${acceptmsg}`)
        .setColor("00FF1D")
        .setFooter(`Accepted`)
        .setTimestamp()
        msg.edit(newembed)
        message.delete()
    }
}