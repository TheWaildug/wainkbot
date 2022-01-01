const MakeEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
module.exports = {
    commands: ["slowmode","sm"],
    description: "Changes slowmode in the current channel.",
    requiredRoles: RequiredRoles,
    expectedArgs: "<slowmode>",
    minArgs: 0,
    maxArgs: null,
    permissionError: "You must be a Staff Member to run this command.",
    Category: "Moderation",
    callback: async (message,args,text,prefix,alias) => {
        let sm = text
        if(!sm){
            return message.channel.send(`The current slowmode in ${message.channel} is ${message.channel.rateLimitPerUser} seconds.`)
        }
       
        if(sm.includes("+")){
            sm = message.channel.rateLimitPerUser + Number(sm.replace("+",""));
        }else if(sm.includes("-")){
            sm = message.channel.rateLimitPerUser - Number(sm.replace("-",""))
        }
        console.log(sm)
        if(isNaN(sm)){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} <slowmode>\`.`, color: "RED"})
                 
                    message.channel.send(embed)
                    return;
        }
        if(sm < 0){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You need to provide a number that's at least 0.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        if(sm > 21600){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You need to provide a number no more than than 21600 (6 Hours).`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        message.channel.setRateLimitPerUser(sm,`Changed by ${message.author.tag}(${message.member.id})`).then(() => {
            message.channel.send(`Changed slowmode to \`${sm}\` seconds.`)
            return;
        }).catch(async e => {
            console.log(e)
            const errorembed = await MakeEmbed({title: `Error`, description: `Something went wrong! \`${e}\``,color: "RED"})
            message.channel.send(errorembed)
            return;
        })
    }
}