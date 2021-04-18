const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()
let prefix = ">"
const evalrole = require("./values/evalroles.js")
const modroles = require("./values/roles.js")
const mongoose = require("mongoose")
const mutemongo = require("./mutemongo")
const fs = require("fs")
let wainkedcolor = "ff00f3"
let rawData = fs.readFileSync('data.json');
let data = JSON.parse(rawData);

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
    if(client.user.id == "832740448909000755"){
      client.user.setStatus("invisible")  
      client.user.setPresence({activity: {name: "new features for wainkbot.", type: `WATCHING`}, status: "dnd"})
    }else{
      client.user.setActivity(data.status, {
        type: "STREAMING",
        url: "https://www.twitch.tv/wainked"
      });
    }
    
  });
  client.on("guildMemberAdd", async member => {
    if(client.user.id != "832740448909000755"){
      console.log(`${member.id}`)
      if(member.id == "745325943035396230"){
        const role = member.guild.roles.cache.get("832404582411927592")
        member.roles.add(role,"User is stupid and fat.")
      }else{
      
        const embed = new Discord.MessageEmbed()
        .setTitle(`Welcome!`)
        .setDescription(`${member} just hopped in!`)
        .setColor("ff00f3")
        .setTimestamp()
        let channel = member.guild.channels.cache.get("816863447156523028");
        channel.send(embed)
      }
    }else{
      if(member.id == "432345618028036097"){
        const embed = new Discord.MessageEmbed()
        .setTitle(`Welcome!`)
        .setDescription(`${member} just hopped in!`)
        .setColor("ff00f3")
        .setTimestamp()
        let channel = member.guild.channels.cache.get("816863447156523028");
        channel.send(embed)
      }
    }
    
  })
  ///Automod
  client.on("message",async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if (message.guild == null) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    const warnemote = message.guild.emojis.cache.get("833398158616821840")
    let args = message.content.split(" ")
    if(client.user.id == "832740448909000755"){
      if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230"){
        return;
      }
    }
    if(message.mentions.members.has("432345618028036097")){
      if(message.member.roles.cache.has("833022116571381780")){
        return console.log(`user is bypass`)
      }
      message.channel.send(`${warnemote} ${message.member}, You're not allowed to ping wainked!`).then(msg => {
        setTimeout(() => {
          msg.delete();
        }, 5000)
      })
      return message.delete()
    }
  })
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if (message.guild == null) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    let args = message.content.split(" ")
    if(client.user.id == "832740448909000755"){
      if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230"){
        return;
      }
    }
    for(let i = 0; i < args.length; i++){
      if(args[i].toLowerCase() == "ok"){
        message.react("🆗")
      }
      if(args[i].toLowerCase() == "aiden"){
        return message.channel.send(
          "Did someone say **Aiden**? I'm pretty sure that's what I heard!"
        );
      }
      if(args[i].toLowerCase() == "wainked"){
        const embed = new Discord.MessageEmbed()
        .setDescription("**Creating viruses...**")
        .setColor("#ff00f3");
      message.channel.send(embed);
      }
    }
    
  });
  const HasPermissions = require("./isbypass")
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if(message.guild == null){
        return;
      }
      if(message.guild.id == "781292314856783892"){
        return;
      }
      if(client.user.id == "832740448909000755"){
        if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230"){
          return;
        }
      }
      if(client.user.id == "832740448909000755"){
        prefix = "&"
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
  
          
      
      }else if(command == "ping"){
        let yourping = Date.now() - message.createdTimestamp
        let botping = Math.round(client.ws.ping)
        const embed = new Discord.MessageEmbed()
        .setTitle(`Pong!`)
        .setDescription(`Message Ping: ${yourping}\nAPI Ping: ${botping}`)
        .setColor(`ff00f3`)
        message.channel.send(embed)
      }else if(command == "status"){
        let status = message.content.split(" ").splice(1).join(" ")
        if(!status){
          return message.reply(`I need a status!`)
        }
        let newData = data
        newData.status = status
        let saveData = JSON.stringify(newData)
        fs.writeFileSync("data.json",saveData)
        client.user.setActivity(status, {
          type: "STREAMING",
          url: "https://www.twitch.tv/wainked"
        });
        message.reply(`go check it out noob.`)
      }else if(command == "mute"){
        client.Commands.get("mute").execute(message,args,modroles)
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