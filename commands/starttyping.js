module.exports = {
    name: [`starttyping`,`starttype`],
    description: "Makes WainkBot typing in the current channel.",
    permissions: "None.",
    arguments: "None.",
    async execute(message,args){
        console.log(`start typing ${message.member.id}`)
        message.delete();
        message.channel.startTyping(5)
        return;
    }
}