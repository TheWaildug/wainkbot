const RequiredRoles = require("../../values/roles")
const MakeEmbed = require("../../makeembed")
const mutemongo = require("../../mutemongo")

const fetch = require("node-fetch")
const ms = require("ms")
async function setData(member,time,reason,moderator,id,logurl){
    const unmutetime = Date.now() + time
    const ne = new mutemongo({
        userid: member.id,
        mutetime: time,
        reason: reason,
        moderator: moderator.id,
        logsurl: logurl,
        ismuted: true,
        unmutetimestamp: unmutetime,
        caseid: id
    })
    console.log(ne)
    await ne.save();
    return;
}
module.exports = {
    commands: ["mute", "shut", "m"],
    description: "Mutes users.",
    expectedArgs: "<user> <time> <reason>",
    requiredRoles: RequiredRoles,
    category: "Moderation",
    permissions: "KICK_MEMBERS",
    permissionError: "You must be a Staff Member to run this command.",
    minArgs: 3,
    maxArgs: null,
    callback: async (message,args) => {
        message.delete();
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
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to mute bots.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.id === message.member.id){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to mute yourself.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.roles.highest.position >= message.member.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to mute users that have a greater than or equal role to you.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(mentionmember.roles.highest.position >= message.guild.me.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: `I cannot mute users that have a higher role than me.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const ismuted = await mutemongo.findOne({userid: mentionmember.id, ismuted: true})
        if(ismuted != null){
            const embed = await MakeEmbed({title: "Permission Denied", description: `This user is already muted.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        const mutedrole = message.guild.roles.cache.get("826093027545710653")
        if(!mutedrole){
            const embed = await MakeEmbed({title: "Missing Role", description: `Cannot find the muted role.`, color: "RED"})
                        message.reply({embeds: [embed]})
                        
                        return;
        }
        if(mutedrole.position >= message.guild.me.roles.highest.position){
            const embed = await MakeEmbed({title: "Permission Denied", description: "The mute role is higher than me. Please move it below my role.", color: "RED"})
            message.reply({embeds: [embed]})
                        
            return;
        }
        if(mentionmember.roles.cache.has(mutedrole)){
            const embed = await MakeEmbed({title: "Permission Denied", description: `This user is already muted.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        
        const time = args[1]
        if(ms(time) == null){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `\`${time}\` is not a real time. Use 1m, 2m, 4h, 2d, etc.`, color: "RED"})
                 
                    message.reply({embeds: [embed]})
                    return;
        }
        console.log(ms(time))
        const reason = args.splice(2).join(" ")
        console.log(reason)
        const unmutetime = Date.now() + ms(time);
        const channel = message.guild.channels.cache.get("825938877327998997")
        if(!channel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the logs channel.`, color: "RED"})
            message.reply({embeds: [embed]})
            
            return;
        }
     
        mentionmember.roles.add(mutedrole).catch(async e => {
            console.log(e)
            const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
            message.reply({embeds: [embed]})
        }).then(async () => {
            const id = message.id
            const logembed = await MakeEmbed({title: "New Mute", description: `**User**\n${mentionmember}\n**Moderator**\n${message.member}\n**Reason**\n${reason}\n**Length of Mute**\n${ms(ms(time,{long: true}))}\n**Case ID**\n${id}`, color: "ff00f3", footer: {text: "Unmute"}, timestamp: unmutetime})
            let logurl = await channel.send({embeds: [logembed]});
            logurl = logurl.url
            console.log(logurl)
            await setData(mentionmember,ms(time),reason,message.member,id,logurl)
            message.channel.send(`<a:checkmark:870842284202164244> ${mentionmember} has been muted with the ID of \`${id}\`.`,{allowedMentions: {parse: []}})
            const dmembed = await MakeEmbed({title: `You've been muted in **${message.guild.name}**.`, description: `**Moderator**\n<@${message.member.id}>\n**Reason**\n${reason}\n**Length of Mute**\n${ms(ms(time,{long: true}))}\n**Case ID**\n${id}`,color: "ff00f3", footer: {text: "Unmute"}, timestamp: unmutetime})
            mentionmember.send({embeds: [dmembed]}).catch(console.log)
            let params = {
                "user": mentionmember.id,
                "reason": reason,
                "logsurl": logurl,
                "caseid": id,
                "mutetime": ms(time),
                "moderator": message.member.id
            }
            params = JSON.stringify(params)
            console.log(params)
            return fetch(process.env.mute, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: params
        }).then(console.log)
        })  

    }

}