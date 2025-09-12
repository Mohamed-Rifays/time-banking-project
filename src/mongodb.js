import { MongoClient } from "mongodb";

const connectionURL =  process.env.MONGO_URI ||"mongodb://127.0.0.1:27017/time-banking";

const databaseName = 'time-banking';

export const client = new MongoClient(connectionURL);
let database;

export async function connectDB() {
  if (!database) {
    await client.connect();
    database = client.db(databaseName);
    console.log(" MongoDB connected");
  }
  return database;
}

export async function saveuser(name,email,password) {
    try{
      
        const db = client.db(databaseName);
        const users = db.collection("users");

        const result = await users.insertOne({
            name : name,
            email : email,
            password : password
        })

        console.log("Inserted Id",result.insertedId);
         return result;
    }catch(error){
        console.log(error);
        console.log("error inserting user info");
        
        
    }
    
}