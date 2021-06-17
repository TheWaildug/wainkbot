const Isbypass = require("../isbypass")
const Discord = require("discord.js")
module.exports = {
    name: "slowmode",
    description: "Changes slowmode in current channel",
    permissions: "Staff Member.",
    arguments: "!slowmode (length) or !slowmode",
    async execute(message,args,roles){
        let cont = await Isbypass(roles,message.member)
        console.log(cont)
        if(cont == false && message.member.id != "432345618028036097"){
            const embed = new Discord.MessageEmbed()
            .setDescription(`You do not have the correct permissions to run this command.`)
            .setColor("FF0000")
            message.channel.send(embed).then(msg => {
              msg.delete({timeout: 5000})
            })
            return message.delete();
          }
        let sm 
        if(!args[0]){
            return message.channel.send(`The current slowmode is \`${message.channel.rateLimitPerUser}\` seconds.`)
        }
        if(args[0].includes("+")){
            sm = message.channel.rateLimitPerUser + Number(args[0].replace("+",""));
        }else if(args[0].includes("-")){
            sm = message.channel.rateLimitPerUser  - Number(args[0].replace("-",""));
        }else{
            sm = args[0]
        }
        console.log(sm)
if(isNaN(sm)){
    return message.channel.send(`This isn't a number but ok.`)
}
if(sm < 0){
    return message.channel.send(`You must provide a slowmode greater or equal to 0.`)
}
if(sm > 21600){
    return message.channel.send(`You must provide a slowmode less than or equal to 21600 (6 Hours).`)
}
message.channel.setRateLimitPerUser(sm,`Changed by ${message.author.tag}`).then(() => {return message.channel.send(`Changed slowmode to \`${sm}\` seconds.`)}).catch(e => {return message.channel.send(`dude something went wrong: \`${e}\``)})
    }
}