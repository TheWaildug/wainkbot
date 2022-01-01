const Discord = require("discord.js")
module.exports = async (text) => {
    const embed = new Discord.MessageEmbed(text)
    console.log(embed)
    return embed
}