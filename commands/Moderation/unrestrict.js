const MakeEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
const RestrictedRoles = require("../../restrictroles")
module.exports = {
    commands: [`unrestrict`],
    description: `Unrestricts user.`,
    expectedArgs: `<user> <reason>`,
    requiredRoles: RequiredRoles,
    Category: `Moderation`,
    permissionError: `You must be a Staff Member to run this command.`,
    minArgs: 2,
    maxArgs: null,
    callback: async (message,args,text) => {
        let mentionmember
        if(message.mentions.members.first()){
            mentionmember = message.mentions.members.first()
          
        }else{
            mentionmember = await message.guild.members.fetch(args[0]).catch(e => {
                console.log(e)
            })    
        }   
        if(!mentionmember || mentionmember.size > 1){
            const embed = await MakeEmbed({title: "Unknown Member", description: `\`${args[0]}\` is not a member.`, color: "RED"})
                 
            message.reply({embeds: [embed]})
            return;
        }
        
        if(mentionmember.user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to unrestrict bots.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.id === message.member.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to unrestrict yourself.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const mmroles = mentionmember.roles.cache
        mmroles.delete("826641307140751411")
        
        if(mmroles.first().position >= message.member.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to unrestrict users that have a greater than or equal role to you.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
       
        if(mentionmember.roles.highest.position >= message.guild.me.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I cannot unrestrict users that have a higher role than me.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const reason = args.splice(1).join(" ")
        console.log(reason)
        const id = message.id
        const channel = message.guild.channels.cache.get("825938877327998997")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the logs channel.`, color: "RED"})
            message.reply({embeds: [embed]})
            
            return;
        }
        let roles = mentionmember.roles.cache
        roles.delete("813837609473933312")
        if(roles.some(r => r.id != "826641307140751411")){
            const embed = await MakeEmbed({title: `Permission Denied`, description: `This user is not restricted.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const rr = await RestrictedRoles.findOne({user: mentionmember.id})
        if(!rr){
            const embed = await MakeEmbed({title: `Permission Denied`, description: `This user is not restricted.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        let rolesarray = []
       rr.roles.forEach(rolee => {
           console.log(rolee)
        const r = message.guild.roles.cache.get(rolee)
        if(r){
            rolesarray.push(r.id)
        }
       })
       console.log(rolesarray)
      
       await mentionmember.roles.add(rolesarray).then(async () => {
        await mentionmember.roles.remove("826641307140751411",`Unrestricted.`)
           await RestrictedRoles.deleteMany({user: mentionmember.id})
        message.channel.send({content: `<a:checkmark:870842284202164244> ${mentionmember} has been unrestricted with the ID of \`${id}\`.`,allowedMentions: {parse: []}})
        const logembed = await MakeEmbed({title: "New Unrestrict", description: `**User:** ${mentionmember}\n**Moderator:** ${message.member}\n**Reason:** ${reason}\n**Case ID:** ${id}`,color: "ff00f3",footer: "Unrestricted",timestamp: Date.now()})
        channel.send({embeds: [logembed]})
       }).catch(async e => {
            console.log(e)
            const embed = await MakeEmbed({title: `Error`, description: `Something went wrong! \`${e}\``, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        })
        
        

    }
}