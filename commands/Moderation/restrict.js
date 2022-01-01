const MakeEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
const RestrictedRoles = require("../../restrictroles")
module.exports = {
    commands: [`restrict`],
    description: `Restricts user.`,
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
                 
            message.channel.send(embed)
            return;
        }
        
        if(mentionmember.user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to restrict bots.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(mentionmember.id === message.member.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to restrict yourself.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to restrict users that have a greater than or equal role to you.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(mentionmember.roles.highest.position >= message.guild.me.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I cannot restrict users that have a higher role than me.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        const reason = args.splice(1).join(" ")
        console.log(reason)
        const id = message.id
        const channel = message.guild.channels.cache.get("825938877327998997")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the logs channel.`, color: "RED"})
            message.channel.send(embed)
            
            return;
        }
        if(mentionmember.roles.cache.some(r => r.id == "826641307140751411")){
            const embed = await MakeEmbed({title: `Permission Denied`, description: `This user is already restricted.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        const mmRoles = mentionmember.roles.cache
        const roleArray = []
        let num = 0
        mmRoles.forEach(r => {
         
            const ro = message.guild.roles.cache.get(r.id)
            if(ro){
                num++
                roleArray.push(ro.id)
            }
            if(mmRoles.size == roleArray.length){
                then()
            }
        })
        console.log(roleArray)
        async function then(){
        
        await RestrictedRoles.deleteMany({user: mentionmember.id})
        const restrict = new RestrictedRoles({
            user: mentionmember.id,
            roles: roleArray
        });
        await restrict.save();
       await mentionmember.roles.remove(roleArray).catch(async e => {
            console.log(e)
            const embed = await MakeEmbed({title: `Error`, description: `Something went wrong! \`${e}\``, color: "RED"})
            message.channel.send(embed)
            return;
        })
        mentionmember.roles.add("826641307140751411",`Restricted.`)
        message.channel.send(`<a:checkmark:870842284202164244> ${mentionmember} has been restricted with the ID of \`${id}\`.`,{allowedMentions: {parse: []}})
        
        const dmembed = await MakeEmbed({title: `You've been restricted in **${message.guild.name}**`,description: `**Moderator**\n<@${message.member.id}>\n**Reason**\n${reason}\n**Case ID**\n${id}\n\nYou can appeal this ban by joining this server [ht឵tps://disc឵ord.gg/dkY឵mpNM2Uh](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`,color: "ff00f3"})
        mentionmember.send(dmembed).catch(console.log)
        const logembed = await MakeEmbed({title: "New Restrict", description: `**User:** ${mentionmember}\n**Moderator:** ${message.member}\n**Reason:** ${reason}\n**Case ID:** ${id}`,color: "ff00f3",footer: "Restricted",timestamp: Date.now()})
        channel.send(logembed)
    }
    }
}