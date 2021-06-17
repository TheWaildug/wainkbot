const afkmongo = require("../afkmongo.js")
module.exports = {
    commands: "afk",
    description: "Gives you an AFK status.",
    permissionError: "If this error shows up, you messed up.s",
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<reason>",
    requiredRoles: [],
    permissions: [],
    callback: async (message,args,text) => {
        let isafk = await afkmongo.findOne({userid: message.member.id})
        console.log(isafk)
        if(isafk != null){
            return message.reply(`You're already afk silly!`);
        }
        afkmongo.deleteMany({userid: message.member.id})
        let afkmsg = args.join(" ")
        if(afkmsg == ""){
            afkmsg = "AFK"
        }
        if(afkmsg.toLowerCase() == "sleep"){
            message.reply(`Sweet Dreams. 💤`,{allowedMentions: {parse: [], users: [message.member.id]}})
            let curname = message.member.displayName
            message.member.setNickname(`[AFK] ${curname}`,`Adding AFK.`).catch(e => console.log(e))
               let afkmo = new afkmongo({userid: message.member.id, afk: afkmsg, afkms: Date.now(), currentname: curname}) 
               afkmo.save()
        }else{
        message.reply(`I have set your AFK, **${afkmsg}**`,{allowedMentions: {parse: [], users: [message.member.id]}})
        let curname = message.member.displayName
        message.member.setNickname(`[AFK] ${curname}`,`Adding AFK.`).catch(e => console.log(e))
           let afkmo = new afkmongo({userid: message.member.id, afk: afkmsg, afkms: Date.now(), currentname: curname}) 
           afkmo.save()
        }
               }
}