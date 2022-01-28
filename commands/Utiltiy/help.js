const HasPermission = require("../../isbypass")
const Discord = require("discord.js")
const MakeEmbed = require("../../makeembed")
const roles = role = require("../../values/roles")
const CreateEmbed = require("../../makeembed")
const loadCommands = require("../load-commands")
const e = require("express")
module.exports = {
    commands: [`help`,`info`,`commands`, `cmds`],
    description: "Shows all of WainkBot's commands.",
    expectedArgs: [`<command>`],
    category: "Utility",
    requiredRoles: ["846099942736265217", "832404582411927592"],
    permissionError: "no",
    minArgs: 0,
    maxArgs: null,
    callback: async (message, arguments, text) => {
        
        const cont = await HasPermission(roles,message.member)
        if(cont == false && message.channel.id != "818890024178155603" && message.channel.id != "832040924267806750"){
            const embed = await CreateEmbed({title: "Permissions Error", description: `Whoops! Make sure to use this command in <#818890024178155603>.`, color: "RED"})
                 message.channel.send({embeds: [embed]})
                 message.delete();
                 return;
        }
        
        let commands = await loadCommands()
        commands.sort((a,b) => {
            let cmdA = a.commands[0].toLowerCase() || a.commands.toLowerCase() 
            let cmdB = b.commands[0].toLowerCase() || b.commands.toLowerCase(); 
            if (cmdA < cmdB) {
              return -1;
            }
            if (cmdA > cmdB) {
              return 1;
            }
          
            // names must be equal
            return 0;
        })
        let prefix = "!"
        if(message.client.user.id == "832740448909000755"){
            prefix = "&"
        }
        let reply = ""
       
        

        let commandsize = 0;
        let newcommands = []
        for(let command of commands){
            let hasPermission = false
            let hasRole = false
            let permissions = command.permissions
            let requiredRoles = command.requiredRoles
            if(requiredRoles){
                
                if(typeof requiredRoles === "string"){
                    requiredRoles = [requiredRoles]
                }
                for(const rr of requiredRoles){
                    const role = message.guild.roles.cache.find(r => r.name == rr) || message.guild.roles.cache.get(rr)
                    if(!role){
                        const cmdName = typeof command.commands === "string" 
            ? command.commands 
            : command.commands[0]
                        console.log(`there isn't a role names ${rr}`)
                        const embed = await MakeEmbed({title: "Missing Role", description: `Cannot find the role **${rr}** for the command **${cmdName}**.`, color: "RED"})
                        message.reply({embeds: [embed]})
                        hasRole = false
                        return;
                    }
                    if(!message.member.roles.cache.has(role.id)){
                        
                        hasRole = false
                    }
                    if(message.member.roles.cache.has(role.id)){
                       
                        hasRole = true
                        break;
                    }
                }
              
            }
            if(permissions){
                
                if(typeof permissions === "string"){
                    permissions = [permissions]
                }
                for(const permission of permissions){
                    if(!message.member.permissions.has(permission)){
                        hasPermission = false 
                    }
                    if(message.member.permissions.has(permission)){
                      
                        hasPerm = true
                        break;
                    }
                }
                
            }
            if(hasRole != true && hasPermission != true){
                continue;
            }
            commandsize++
            const mainCMD = typeof command.commands === "string" 
            ? command.commands 
            : command.commands[0]
            
            if(typeof command.commands === "string"){
                command.commands[0] = command.commands
            }
           const args = command.expectedArgs
            const { description } = command
            const array = {
                mainCommand: mainCMD,
                description: description,
                args: args
            }
            reply += `**${prefix}${mainCMD} ${args}** - ${description}\n`
            newcommands.push(array)
        }
        const cmdembed = new Discord.MessageEmbed()
        .setTitle(`All commands for **${message.client.user.tag}**`)
        .setDescription(reply)
        .setColor("ff00f3")
        .setTimestamp()
       message.reply({embeds: [cmdembed]})
        
    
    }
}