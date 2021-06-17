const Discord = require("discord.js")
const fs = require("fs")
const ms = require("ms")
module.exports = {
    name: "restart",
    description: "Restarts the bot.",
    permissions: "You gotta be cool man.",
    arguments: "None.",
    async execute(message,args){
        if(message.member.id != "432345618028036097"){
            const embed = new Discord.MessageEmbed()
            .setDescription(`You do not have the correct permissions to run this command.`)
            .setColor("FF0000")
            message.channel.send(embed).then(msg => {
              msg.delete({timeout: 5000})
            })
            return message.delete();
          }
          let information = { 
            channel: message.channel.id,
            currenttime: new Date().getTime(),
            active: true
        };
         
        let data = JSON.stringify(information);
        fs.writeFileSync('information.json', data);
        message.channel.send(`Restarting...`).then(() => {
            return process.exit();
        })
        
       
    }
}