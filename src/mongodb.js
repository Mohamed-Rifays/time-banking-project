import { MongoClient } from "mongodb";

const connectionURL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/time-banking";
const databaseName = "time-banking";

export const client = new MongoClient(connectionURL);
let database;

export async function connectDB() {
  if (!database) {
    await client.connect();
    database = client.db(databaseName);
    console.log("✅ MongoDB connected");
  }
  return database;
}

export async function saveuser(name, email, password) {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return { success: false, message: "Email already registered" };
    }

    const result = await users.insertOne({
      name,
      email,
      password,
      balance: 1, 
      createdAt: new Date()
    });

    console.log("Inserted Id:", result.insertedId);
    return { success: true, userId: result.insertedId };
  } catch (error) {
    console.error("Error inserting user:", error);
    return { success: false, message: "DB error" };
  }
}
