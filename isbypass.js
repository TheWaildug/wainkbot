module.exports = (rolesarray,member) => {
    
    
        for (let i = 0; i < rolesarray.length; i++) {
          if(member.roles.cache.has(rolesarray[i])){
            
            return true;
          }
        }
        return false;
      
}