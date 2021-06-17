module.exports = {
    name: "mock",
    description: "MaKeS tEXT lIKe This",
    permissions: "None.",
    arguments: "!mock (text)",
    async execute(message,args){
        let msg = args.join(" ")
        if(msg == null){
          return message.reply(`i nEED SOme tExt tO mOcK`)
        }
        let mock = require("../mock")(msg)
        return message.channel.send(mock,{allowedMentions: {parse: []}})
    }
}