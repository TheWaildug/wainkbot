const CreateEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
module.exports = {
    commands: ["chain"],
    description: "Sends a chain message in <#830510753155907584>",
    requiredRoles: RequiredRoles,
    expectedArgs: "<message>",
    minArgs: 1,
    maxArgs: null,
    permissonError: "You must be a staff member to run this command.",
    Category: "Fun",
    callback: async (message,args,text) => {
        const channel = message.guild.channels.cache.get("830510753155907584")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the chains channel.`, color: "RED"})
            message.reply({embeds: [embed]})
            
            return;
        }
        channel.send(text,{allowedMentions: {parge: []}}).catch(async e => {
            console.log(e)
            const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.reply({embeds: [embed]})
        })
        message.delete();
    }
}