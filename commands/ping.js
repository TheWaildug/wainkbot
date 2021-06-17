const Discord = require("discord.js")
module.exports = {
    name: "ping",
    description: "Shows ping for WainkBot.",
    permissions: "None.",
    arguments: "None.",
    async execute(message,args,client){
        console.log(`ping`)
        let yourping = new Date().getTime() - message.createdTimestamp 
        let botping = Math.round(client.ws.ping)
        const embed = new Discord.MessageEmbed()
        .setTitle(`Pong!`)
        .setDescription(`Message Ping: ${yourping}\nAPI Ping: ${botping}`)
        .setColor(`ff00f3`)
        message.channel.send(embed)
    }
}