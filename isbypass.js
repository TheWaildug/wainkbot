module.exports = (rolesarray,member) => {
    
    
        for (let i = 0; i < rolesarray.length; i++) {
          if(member.roles.cache.has(rolesarray[i])){
            console.log(`User has the ${rolesarray[i]} role.`)
            return true;
          }
        }
        return false;
      
}