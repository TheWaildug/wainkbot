const HasPermission = require("../isbypass");
const Discord = require("discord.js")
let role
async function hasrightperm(perm,member){
    if(perm == "None."){
        return true;
    }else if(perm == "Staff Member."){
        let hasperm = await HasPermission(role,member)
        if(hasperm == true){
            return true;
        }else{
            return false;
        }
    }else if(perm == "<@&813840097166360577>."){
        if(member.roles.cache.has("813840097166360577")){
            return true;
        }else{
            return false;
        }
    }else if(perm == "<@&833021553935122432>."){
        if(member.roles.cache.has("833021553935122432")){
            return true;
        }else{
            return false;
        }
    }else if(perm == "You gotta be cool man."){
        if(member.id == "432345618028036097"){
            return true;
        }else{
            return false;
        }
    }
}
module.exports = {
    name: [`help`,`info`,`commands`],
    description: "Shows all commands.",
    permissions: "None.",
    arguments: "!help or !help (command)",
    async execute(message,args,commands,roles){
        role = roles
        const cont = await HasPermission(roles,message.member)
        if(cont == false && message.channel.id != "818890024178155603" && message.channel.id != "832040924267806750"){
            return message.reply(`Whoops! Make sure to use this in <#818890024178155603>.`);
        }
        for(const command of commands){
            let permissions = command.permissions
            if(permissions){
                let hasPermission = true
                if(await hasrightperm(permissions,message.member == false)){
                    haspermission = false
                    break;
                }
                if(!hasPermission){
                    continue;
                }
            } 
            const mainCommand = typeof command.name === "string" ? command.name : command.name[0]

        }

        
    }
}