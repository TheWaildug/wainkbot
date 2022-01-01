const MakeEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
module.exports = {
    commands: ["say", "talk"],
    description: "Makes WainkBot say something.",
    requiredRoles: RequiredRoles,
    expectedArgs: "<channel/message> <message>",
    minArgs: 1,
    maxArgs: null,
    permissionError: "You must be a Staff Member to run this command.",
    Category: "Fun",
    callback: async (message,args,text,prefix) => {
        let mentionchannel
        let switchargs = false
        if(message.mentions.channels.first()){
            mentionchannel = message.mentions.channels.first()
        }else if(!isNaN(args[0])){
            mentionchannel = message.guild.channels.cache.get(args[0])
        }else {
            mentionchannel = message.channel
            switchargs = true
        }
        if(!mentionchannel){
            switchargs = true
            mentionchannel = message.channel
        }
       
        if(mentionchannel.id == "830510753155907584"){
           const embed = await MakeEmbed({title: "Permission Denied", description: `The **${prefix}chain** command exists ya know?`, color: "RED"})
           message.channel.send(embed);
    
           return;
          }
          console.log(mentionchannel.name)
          let msg = ""
          if(switchargs == false){
              msg = args.splice(1).join(" ")
          }else if(switchargs == true){
              msg = text
          }
          console.log(msg)
          if(!msg){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}say <channel/message> <message>\`.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
          }
          message.delete();
          mentionchannel.send(msg).catch(async e => {
              console.log(e)
              const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
              message.channel.send(embed)
              return;
          })
    }
}