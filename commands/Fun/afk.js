const afkmongo = require("../../afkmongo")
module.exports = {
    commands: "afk",
    description: "Gives you an AFK status.",
    permissionError: "If you see this, something went wrong.",
    minArgs: 0,
    category: "Fun",
    maxArgs: null,
    expectedArgs: "<reason>",
    requiredRoles: ["@everyone"],
    callback: async (message,args,text) => {
        let isafk = await afkmongo.findOne({userid: message.member.id})
        console.log(isafk)
        if(isafk != null){
            return message.reply(`You're already afk silly!`);
        }
        afkmongo.deleteMany({userid: message.member.id})
        let afkmsg = text
        if(afkmsg == ""){
            afkmsg = "AFK"
        }
        if(afkmsg.toLowerCase().includes("sleep") || afkmsg.toLowerCase().includes("slep")){
            message.reply({content: "Sweet Dreams. 💤",allowedMentions: {parse: [], users: [message.member.id]}})
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