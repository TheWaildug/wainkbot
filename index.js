const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()
const prefix = ">"
const evalrole = require("./values/evalroles.js")
const modroles = require("./values/roles.js")
const mongoose = require("mongoose")
const fs = require("fs")
mongoose.connect(process.env.mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log("Connected to MongoDB")).catch(error => {
  console.log(error)
})
client.Commands = new Discord.Collection();

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.Commands.set(command.name, command);
  }

  
client.on("ready", () => {
    console.log("I'm ready, Aiden!");
    client.user.setActivity("🍇", {
      type: "STREAMING",
      url: "https://www.twitch.tv/wainked"
    });
  });
  client.on("guildMemberAdd", async member => {
    console.log(`${member.id}`)
    if(member.id == "745325943035396230"){
      const role = member.guild.roles.cache.get("832404582411927592")
      member.roles.add(role,"User is stupid and fat.")
    }else{
      let members = await member.guild.members.fetch()
      let membercount = members.size
      const embed = new Discord.MessageEmbed()
      .setDescription(`${member} just popped in! We're now at ${membercount} members!`)
      .setColor("ff00f3")
      let channel = member.guild.channels.cache.get("816863447156523028");
      channel.send(embed)
    }
  })
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
  const HasPermissions = require("./isbypass")
  client.on("message", async message => {
    if(message.guild == null){
        return;
      }
      if(message.guild.id == "781292314856783892"){
        return;
      }
      if(!message.content.startsWith(prefix)){
        return;
      }
      if(message.author.bot){
          return;
        }
      const args = message.content.slice(prefix.length).split(" ")
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
  
          
      }else if(command == "kick"){
        client.Commands.get("kick").execute(message,args,modroles)
      }
  })

  const express = require("express")
  const server = express()
  server.listen(3000, ()=>{console.log("Server is Ready!")}); 
  server.all('/', (req, res)=>{
    res.send('wainked is meanie')
})
client.login(process.env.token)