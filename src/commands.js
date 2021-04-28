const {PREFIX}=require('../config.json')

module.exports = (client,alias,callback)=>{
    if(typeof aliases==='string'){
        aliases=[aliases]
    }
    client.on('message', (message) => {
        const [CMD_NAME,...args]= message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        if(CMD_NAME===alias){
            callback(message,args)
        }
    });
}