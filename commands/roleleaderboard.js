module.exports = {
    name: [`roleleaderboard`,`rleaderboard`,`rl`],
    description: "Shows the top 10 users with the highest role count.",
    permissions: "None.",
    arguments: "None.",
    async execute(message,args){
        console.log(`role leaderboard ${message.member.id}`)
  
        message.reply(`Let me find the top 5 role leaders...`).then(me => {
          message.channel.startTyping()
          let list = message.guild.members.cache.sort((e,ee) => ee.roles.cache.size - e.roles.cache.size).array()
        let user1 = message.guild.members.cache.find(u => u.id == list[0].id)
          let user2 = message.guild.members.cache.find(u => u.id == list[1].id)
           let user3 = message.guild.members.cache.find(u => u.id == list[2].id)
           let user4 = message.guild.members.cache.find(u => u.id == list[3].id)
           let user5 = message.guild.members.cache.find(u => u.id == list[4].id)
         const format = `Here are the top 5 users: \n1. <@${user1.id}> - Roles: ${user1.roles.cache.filter(r => r.name != "@everyone").size}.\n2. <@${user2.id}> - Roles: ${user2.roles.cache.filter(r => r.name != "@everyone").size}.\n3. <@${user3.id}> - Roles: ${user3.roles.cache.filter(r => r.name != "@everyone").size}.\n4. <@${user4.id}> - Roles: ${user4.roles.cache.filter(r => r.name != "@everyone").size}\n5. <@${user5.id}> - Roles: ${user5.roles.cache.filter(r => r.name != "@everyone").size}`
         
       setTimeout(() => {
        message.channel.stopTyping(true)
        me.delete();
         message.channel.send(format,{allowedMentions: {parse: []}})
       },10000)
        })
          
    }
}