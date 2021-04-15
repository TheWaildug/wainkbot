const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()
const evalrole = require("./values/evalroles.js")

client.on("ready", () => {
    console.log("I'm ready, Aiden!");
    client.user.setActivity("🍇", {
      type: "STREAMING",
      url: "https://www.twitch.tv/wainked"
    });
  });
  client.on("message", async message => {
    if (message.guild == null) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    if (message.content.toLowerCase() == "aiden") {
      return message.channel.send(
        "Did someone say **Aiden**? I'm pretty sure that's what I heard!"
      );
    }
    if (message.content.toLowerCase() == "wainked") {
      const embed = new Discord.MessageEmbed()
        .setDescription("**Creating viruses...**")
        .setColor("#ff00f3");
      message.channel.send(embed);
    }
  });
  async function HasPermissions(rolesarray,member){
    
    for (let i = 0; i < rolesarray.length; i++) {
      if(member.roles.cache.has(rolesarray[i])){
        console.log(`User has the ${rolesarray[i]} role.`)
        return true;
      }
    }
    return false;
  }
  client.on("message", async message => {
    if(message.guild == null){
        return;
      }
      if(message.guild.id == "781292314856783892"){
        return;
      }
      if(!message.content.startsWith("!")){
        return;
      }
      if(message.author.bot){
          return;
        }
      const args = message.content.slice(1).split(" ")
      const command = args.shift().toLowerCase();
      if(command == "eval"){
        let cont = await HasPermissions(evalrole,message.member)
       console.log(cont)
        if(cont == false){
          const embed = new Discord.MessageEmbed()
          .setDescription(`You do not have the correct permissions to run this command.`)
          .setColor("FF0000")
          message.channel.send(embed).then(msg => {
            msg.delete({timeout: 5000})
          })
          return message.delete();
        }
        let code = message.content.split(" ").slice(1).join(" ")
     console.log(`Eval ${code}`)
    
        console.log(`Evaluate ${message.author.id}`)
        if(code == ""){
            return message.channel.send(`I need some code dude.`)
        }
        let evaluated
         
      try {
        evaluated = await eval(`(async () => {  ${code}})()`);
        console.log(evaluated)
        const evaltype = typeof evaluated;
        const embed = new Discord.MessageEmbed()
              .setTitle(`Evaluation`)
              .setColor("RANDOM")
              .setDescription(`Evaluated in *${Date.now() - message.createdTimestamp + " ms"}.*`)
              .addField(`Input`,"```js\n" + code + "```")
              .addField(`Output`,"```\n" + evaluated + "```")
              .addField("Output Type", "`" + evaltype.toUpperCase() + "`")
              .setTimestamp()
               message.channel.send(`<@${message.author.id}>`,embed)
            
      } catch (e) {
        console.log(e)
            const embed = new Discord.MessageEmbed()
            .setTitle(`Evaluation`)
                .setColor("RANDOM")
            .setDescription(`Error`)
            .addField(`Input`,"```js\n" + code + "```")
            .addField(`Error`,"```" + e + "```")
            .setTimestamp()
             message.channel.send(`<@${message.author.id}>`,embed)
             
      }
  
          
      }
  })
client.login(process.env.token)