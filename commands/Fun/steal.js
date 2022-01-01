
const MakeEmbed = require("../../makeembed")

module.exports = {
    commands: ["steal"],
    description: "Steals an emoji from another server.",
    expectedArgs: "<emoji>",
    category: "Fun",
    requiredRoles: "@everyone",
    permissionError: "If you see this, something went wrong.",
    minArgs: 1,
    maxArgs: null,
    callback: async (message,args,text) => {
        const emoteRegex = /<:.+:(\d+)>/gm
        const animatedEmoteRegex = /<a:.+:(\d+)>/gm
      const msg = args[0]
      let emojiurl = null
        if (emoji = emoteRegex.exec(msg)) {
            console.log(emoji)
        emojiurl = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"
        }
        else if (emoji = animatedEmoteRegex.exec(msg)) {
         emojiurl = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1"
       
        }
        if(emojiurl == null){

        
            const embed = await MakeEmbed({title: "Unknown Emoji.", description: `**${msg}** is not an emoji.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }else{
            let name = msg.match(/\w+/g)
            name = name[1]
            message.guild.emojis.create(emojiurl,name,{reason: `Emoji stolen by ${message.author.id}`}).then((emote) => {
                message.channel.send(`${emote} stolen with name **${name}**.`,{allowedMentions: {parse: []}})
            }).catch(async e => {
                console.log(e)
                const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
                message.channel.send(embed)
            })
        }
    }
}