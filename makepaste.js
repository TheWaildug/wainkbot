const req = require('petitio');
module.exports = async (body,ext) => {
   
        const res = await req('https://hst.sh/documents', 'POST')
          .body(body)
          .timeout(15000)
          .send();
      
        if (res.statusCode === 200)
          return `https://hst.sh/${res.json().key}.${ext}`;
        return `Could not upload data to hst.sh, status ${res.statusCode}`;
      
}
