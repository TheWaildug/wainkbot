module.exports = async (p) => { 
    let regex = /[\\<>@#&!]/g
    let ping = p
    console.log(ping)
    if(regex.test(ping)){
        ping = ping.replace(regex,"")
        console.log(ping)
        return ping
    }else {
       
        return ping
    }
}