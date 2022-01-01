const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: ["purge","prune","clear","sweep"],
    description: `Purges certain amount of messages.`,
    requiredRoles: RequiredRoles,
    expectedArgs: "<user/amount> <amount>",
    minArgs: 1,
    permissionError: "You must be a Staff Member to run this command.",
    maxArgs: null,
    Category: "Moderation",
    callback: async (message,args) => {
        let contin = true
        let mentionmember = message.mentions.members.first()
        if(!mentionmember){
            contin = false
        }
        if(contin == true){
            args[0] = args[1]
        }
        const amnt = args[0]
        if(isNaN(amnt)){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `\`${amnt}\` is not a number.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        if(Number(amnt) <= 0){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You need to provide a number greater than 0.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        if(Number(amnt) >= 100){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You need to provide a number less than 100.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
    
        console.log(amnt)
        let messages = await message.channel.messages.fetch();
        if(!messages){
            const embed = await MakeEmbed({title: "Error", description: `There is nothing to purge.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        if(contin == true){
            messages = messages.filter(m => m.author.id == mentionmember.id)
            if(!messages){
                const embed = await MakeEmbed({title: "Error", description: `There is nothing to purge.`, color: "RED"})
                 
                message.channel.send(embed)
                return;
            }
            let newmsg = []
            let msgsize = 0
            messages.forEach(msg => {
                if(msgsize > args[0]){
                    return;
                }
                newmsg.push(msg);
                msgsize++
            })
            messages = newmsg
        }else {
            let newmsg = []
            let msgsize = 0
            messages.forEach(msg => {
                if(msgsize > args[0]){
                    return;
                }
                newmsg.push(msg);
                msgsize++
            })
            messages = newmsg
        }
        if(!messages){
            const embed = await MakeEmbed({title: "Error", description: `There is nothing to purge.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        message.channel.bulkDelete(messages).catch(async e => {
            console.log(e)
                const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.channel.send(embed)
            return;
        })
        const success = await MakeEmbed({title: `Purge`, description: `Purged \`${amnt}\` messages from ${message.channel}.`,color: "ff00f3"})
        message.channel.send(success).then(msg => {
            setTimeout(() => {
                msg.delete();
            }, 5 * 1000)
        })
    }
}