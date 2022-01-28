
const Discord = require("discord.js")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: "test",
    description: "Test",
    requiredRoles: "832404582411927592",
    category: "Utility",
    permissionError: "You cannot run this command.",
    expectedArgs: [],
    minArgs: null,
    maxArgs: null,
    callback: async (message,args) => {
        const embed = new Discord.MessageEmbed().setColor("#ff00f3").setDescription("ok")
        console.log(args[0])
        if(args[0] == null){
            args[0] = "1"
        }
        switch (args[0]) {
            case "1":
                embed
                    .setTitle("test")
                    
                    .addFields(
                        { name: '**Test**', value: 'ok.' },
                        { name: '**bob**', value: 'bob is cool.' },
                        { name: '**please help**', value: 'my family is missing .' },
                    )
                   
                break;
            case "2":
                embed
                    .setTitle("test Page 2")
                    .addFields(
                        { name: '**1**', value: 'ok.' },
                        { name: '**22**', value: 'bob is cool.' },
                        { name: '**234 help**', value: 'my family is missing .' },
                    )
                break;
            case "3":
                embed
                .setTitle("test Page 3 ")
                .addFields(
                    { name: '**ee**', value: 'ok.' },
                    { name: '**325r2**', value: 'bob is cool.' },
                    { name: '**please**', value: 'my family is missing .' },
                )
                break;
        
           
            }
            message.channel.send({embeds: [embed]})
        }
}