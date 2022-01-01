const CreateEmbed = MakeEmbed = require("../../makeembed")
const roles = require("../../values/roles")
const HasPermissions = require("../../isbypass")
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
                 message.channel.send(embed)
                 message.delete();
                 return;
        }
        console.log(`role leaderboard ${message.member.id}`)
        message.reply("Let me find the top 5 leaders...").then(async msg => {
            message.channel.startTyping();
            let list = message.guild.members.cache
            //list = list.filter(e => e.id != "432345618028036097")
            list = list.sort((e,ee) => ee.roles.cache.size - e.roles.cache.size).array()
            //let wail = message.guild.members.cache.find(u => u.id == "432345618028036097")
            let user1 = message.guild.members.cache.find(u => u.id == list[0].id)
              let user2 = message.guild.members.cache.find(u => u.id == list[1].id)
               let user3 = message.guild.members.cache.find(u => u.id == list[2].id)
               let user4 = message.guild.members.cache.find(u => u.id == list[3].id)
               let user5 = message.guild.members.cache.find(u => u.id == list[4].id)
              const format = `Here are the top 5 users: \n1. <@${user1.id}> - Roles: ${user1.roles.cache.filter(r => r.name != "@everyone").size}. \n2. <@${user2.id}> - Roles: ${user2.roles.cache.filter(r => r.name != "@everyone").size}.\n3. <@${user3.id}> - Roles: ${user3.roles.cache.filter(r => r.name != "@everyone").size}.\n4. <@${user4.id}> - Roles: ${user4.roles.cache.filter(r => r.name != "@everyone").size}.\n5. <@${user5.id}> - Roles: ${user5.roles.cache.filter(r => r.name != "@everyone").size}`
               //const format = `Here are the top 5 users: \n1. <@${wail.id}> - Roles: 69420. \n2. <@${user1.id}> - Roles: ${user1.roles.cache.filter(r => r.name != "@everyone").size}.\n3. <@${user2.id}> - Roles: ${user2.roles.cache.filter(r => r.name != "@everyone").size}.\n4. <@${user3.id}> - Roles: ${user3.roles.cache.filter(r => r.name != "@everyone").size}.\n5. <@${user4.id}> - Roles: ${user4.roles.cache.filter(r => r.name != "@everyone").size}`
               setTimeout(() => {
                message.channel.stopTyping(true)
                msg.delete();
                 message.channel.send(format,{allowedMentions: {parse: []}})
               },10000) 
        })
    }
}