import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {saveuser} from './mongodb.js'
import { client } from './mongodb.js';


const app = express();
const port = 5000;
app.use(cors());
app.use(express.json())

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const renderHTML = path.join(__dirname,'../public')

app.use(express.static(renderHTML))

app.get("",(req,res)=>{
    res.sendFile(path.join(renderHTML,"index.html"))
})

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

   await saveuser(name,email,password)

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error saving user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = client.db("time-banking");
    const users = db.collection("users");

    // Check if user exists
    const user = await users.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    res.json({ message: "Login successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port ,"0.0.0.0",()=>{
    console.log(`server is up on port http://localhost:${port}`);
    
})