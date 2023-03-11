const { MongoClient } = require("mongodb");
// mongo client gives us access to function to connect wirth database
let dbConnection;
module.exports={
    
    connectToDb:(cb)=>{
        MongoClient.connect('mongodb+srv://AmanJadon:Gemini%4012345@cluster0.ud7w084.mongodb.net/Tickets?retryWrites=true&w=majority').then((client)=>{
            dbConnection=client.db();
            cb(dbConnection)
        }).catch((err)=>{
            return cb(err)
        })
    },
    getDb:()=>{return dbConnection}
}