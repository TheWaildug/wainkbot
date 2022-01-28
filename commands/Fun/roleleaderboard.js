const CreateEmbed = MakeEmbed = require("../../makeembed")
const roles = require("../../values/roles")
const HasPermissions = require("../../isbypass")
const makepaste = require("../../makepaste")
module.exports = {
    commands: ["roleleaderboard","rl","rleaderboard"],
    description: "Shows the top 5 users with the most roles.",
    expectedArgs: [],
    requiredRoles: "@everyone",
    minArgs: null,
    maxArgs: null,
    Category: "Fun",
    permissionError: "If you can see this, something went wrong.",
    callback: async (message,args) => {
        const cont = await HasPermissions(roles,message.member)
        if(cont == false && message.channel.id != "818890024178155603" && message.channel.id != "832040924267806750"){
            const embed = await CreateEmbed({title: "Permissions Error", description: `Whoops! Make sure to use this command in <#818890024178155603>.`, color: "RED"})
                 message.channel.send({embeds: [embed]})
                 message.delete();
                 return;
        }
        console.log(`role leaderboard ${message.member.id}`)
        message.reply("Let me find the top 5 leaders...").then(async msg => {
            message.channel.sendTyping();
            let members = await message.guild.members.fetch();
            let list = members
           
            //list = list.filter(e => e.id != "432345618028036097")
            list = list.sort((e,ee) => ee.roles.cache.size - e.roles.cache.size)
            
            
           
            //let wail = members.find(u => u.id == "432345618028036097")
            
            let user1 = Array.from(list)[0]
            user1 = {userId: user1[0], roles: user1[1].roles.cache.filter(r => r.name != "@everyone").size}
            let user2 = Array.from(list)[1]
            user2 = {userId: user2[0], roles: user2[1].roles.cache.filter(r => r.name != "@everyone").size}
            let user3 = Array.from(list)[2]
            user3 = {userId: user3[0], roles: user3[1].roles.cache.filter(r => r.name != "@everyone").size}
            let user4 = Array.from(list)[3]
            user4 = {userId: user4[0], roles: user4[1].roles.cache.filter(r => r.name != "@everyone").size}
            let user5 = Array.from(list)[4]
            user5 = {userId: user5[0], roles: user5[1].roles.cache.filter(r => r.name != "@everyone").size}
              const format = `Here are the top 5 users: \n1. <@${user1.userId}> - Roles: ${user1.roles}. \n2. <@${user2.userId}> - Roles: ${user2.roles}.\n3. <@${user3.userId}> - Roles: ${user3.roles}.\n4. <@${user4.userId}> - Roles: ${user4.roles}.\n5. <@${user5.userId}> - Roles: ${user5.roles}`
               //const format = `Here are the top 5 users: \n1. <@${wail.id}> - Roles: 69420. \n2. <@${user1.id}> - Roles: ${user1.roles.cache.filter(r => r.name != "@everyone").size}.\n3. <@${user2.id}> - Roles: ${user2.roles.cache.filter(r => r.name != "@everyone").size}.\n4. <@${user3.id}> - Roles: ${user3.roles.cache.filter(r => r.name != "@everyone").size}.\n5. <@${user4.id}> - Roles: ${user4.roles.cache.filter(r => r.name != "@everyone").size}`
               setTimeout(() => {
                msg.delete();
                 message.channel.send({content: format,allowedMentions: {parse: []}})
               },10000) 
        })
    }
}