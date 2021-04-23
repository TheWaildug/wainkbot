const afkmongo = require("../afkmongo.js")
module.exports = {
    name: "afk",
    description: "makes you afk?",
   async execute(message,args){
        let isafk = await afkmongo.findOne({userid: message.member.id})
        console.log(isafk)
        if(isafk != null){
            return message.reply(`You're already afk silly!`);
        }
        afkmongo.deleteMany({userid: message.member.id})
        let afkmsg = args.join(" ")
           let afkmo = new afkmongo({userid: message.member.id, afk: afkmsg, afkms: Date.now()}) 
           afkmo.save()
           message.reply(`I have set your AFK, **${afkmsg}**`,{allowedMentions: {parse: [], users: [message.member.id]}})
    }
}