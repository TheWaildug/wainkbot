const HasPermissions = require("../isbypass")
module.exports = {
    name: "chain",
    description: "Sends a chain message in <#830510753155907584>",
    permissions: "Staff Member.",
    arguments: "!chain (message)",
    async execute(message,args,roles){
        const isbypass = await HasPermissions(roles,message.member)
        if(isbypass == false){
          return message.delete();
        }
        if(message.channel.id != "830510753155907584"){
          return message.reply(`Run this in the <#830510753155907584> channel idiot.`)
        }
        let chainmsg = args.join(" ")
        if(!chainmsg){
          return message.reply(`I need something to chain idiot.`)
        }
        console.log(`chain ${chainmsg}`)
        const channel = message.guild.channels.cache.get("830510753155907584")
        channel.send(chainmsg,{allowedMentions: {parse: []}}).catch(e => {
          console.log(e);
        })
        message.delete();
       
    }
}