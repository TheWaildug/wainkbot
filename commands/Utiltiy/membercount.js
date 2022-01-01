const Discord = require("discord.js")
const HasPermissions = require("../../isbypass")
const roles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: [`membercount`,`mcount`,`members`],
    description: "Shows current member count in **wainked®.**",
    expectedArgs: [],
    category: "Utility",
    requiredRoles: "@everyone",
    permissionError: "If you see this, something went wrong.",
    minArgs: null,
    maxArgs: null,
    callback: async (message, arguments, text) => {
        let cont = await HasPermissions(roles,message.member)
        console.log(cont)
        if(cont == false && message.member.id != "432345618028036097" && message.channel.id != "818890024178155603"){
            const embed = await CreateEmbed({title: "Permissions Error", description: `Whoops! Make sure to use this command in <#818890024178155603>.`, color: "RED"})
            message.channel.send(embed)
            message.delete();
            return;
          } 
          console.log('serverinfo')
       const { guild } = message
       const { name } = guild
       let memberCount = await guild.members.fetch()
       console.log(memberCount.size)
       const embed = new Discord.MessageEmbed()
       .setColor("ff00f3")
       .setTitle(`Member Count`)
       .setDescription(`${name} is currently at **${memberCount.size} members**!`)
     
         
           message.channel.send(embed)
    }
}