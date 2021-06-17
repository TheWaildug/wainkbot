module.exports = {
    name: "stoptyping",
    description: "Makes WainkBot stop typing in the current channel.",
    permissions: "None.",
    arguments: "None.",
    async execute(message,args){
        console.log(`stop typing ${message.member.id}`)
        message.delete();
        message.channel.stopTyping(true)
        return;
    }
}