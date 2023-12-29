module.exports.getPostData=(req)=> {
    return new Promise((resolve, reject) => {
       try {
           let body = '';
           req.on('data', chunk => {
               body += chunk.toString(); // convert Buffer to string
           });
  
           req.on('end', () => {
               //resolve(parse(body));
               if(body===''){
                resolve()
               }
               else{
                resolve(JSON.parse(body));
               }
               
           });
       }
       catch (e) {
           reject(e);
       }
    });
  }
  