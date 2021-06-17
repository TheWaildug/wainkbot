const HasPermission = require("../isbypass");
const Discord = require("discord.js")
let role
async function hasrightperm(perm,member){
    if(perm == "None."){
        return true;
    }else if(perm == "Staff Member"){
        let hasperm = await HasPermission(role,member)
        console.log(hasperm)
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
    name: "help",
    description: "Shows all commands.",
    permissions: "None.",
    arguments: "!help or !help (command)",
    async execute(message,args,commands,roles){
        role = roles
        const cont = await HasPermission(roles,message.member)
        if(cont == false && message.channel.id != "818890024178155603"){
            return message.reply(`Whoops! Make sure to use this in <#818890024178155603>.`);
        }
        let allcommands = new Discord.Collection();
        try{
            commands.each(async command => {
                let hasperm = await hasrightperm(command.permissions,message.member)
                console.log(`${command.name} ${hasperm}`)
                if(hasperm == true){
                    allcommands.set(command.name,command)
                }
            })
        }finally{
            console.log(allcommands)
        }
    }
}