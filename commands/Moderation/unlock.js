const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: ["unlock","ul","open"],
    description: "Unlocks a channel.",
    requiredRoles: RequiredRoles,
    category: "Moderation",
    permissionError: "You must be a Staff Member to run this command.",
    expectedArgs: "<channel/reason> <reason>",
    minArgs: 1,
    maxArgs: null,
    callback: async (message,args,text,prefix,alias) => {
      
        let mentionchannel = message.mentions.channels.first();
        let reason
        if(mentionchannel){
            reason = args.splice(1).join(" ")
        }else{
            console.log(`no mentioned channel`)
            mentionchannel = message.channel
            reason = text
        }
        if(!reason){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} <channel/reason> <reason>\`.`, color: "RED"})
                 
            message.channel.send(embed)
            return; 
        }
        
        console.log(mentionchannel.name)
        console.log(reason)
        const everyone = message.guild.roles.everyone
        let canchat = mentionchannel.permissionsFor(everyone).serialize();
        console.log(canchat.SEND_MESSAGES)
        if(canchat.SEND_MESSAGES == true || canchat.SEND_MESSAGES == null){
            const embed = await MakeEmbed({title: "Permission Denied", description: `This channel is already unlocked.`, color: "RED"})
            message.channel.send(embed)
            return;
          }
          mentionchannel.updateOverwrite(everyone,{SEND_MESSAGES: null},`Unlocked by ${message.author.tag}(${message.author.id}) with the reason of ${reason}.`).catch(async e => {
            console.log(e)
            const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
        message.channel.send(embed)
        return;
          })
          const channelembed = await MakeEmbed({title: "Channel Unlocked.",description: `This channel has been unlocked by a staff member. You can now chat here.\n\n**Reason**\n ${reason}`, color: "ff00f3",footer: {text: `Unlocked by ${message.author.tag}`}, timestamp: Date.now()});
          mentionchannel.send(channelembed)

          
    }
}