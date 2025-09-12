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
    const db = client.db("time-banking");
    const users = db.collection("users");

     const user = await users.findOne({ email });

     if(user){
 return res.status(400).json({ message: "Email is already registered" });     }

   await saveuser(name,email,password)

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error saving user" });
  }
});

app.post("/offerskill", async (req, res) => {
  try {
    const { skillName, description, availability, email } = req.body;

     const db = client.db("time-banking");
    const skills = db.collection("skills");

    if (!skillName || !description || !availability || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await skills.insertOne({

      skillName,
      description,
      availability,
      email,
      createdAt: new Date()
      
    });

    res.json({ message: "Skill offered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving skill" });
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

    res.json({ message: "Login successful!", name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getskills", async (req, res) => {
  try {
    const db = client.db("time-banking");
    const skills = db.collection("skills");

    const skillList = await skills.find().toArray();
    res.json(skillList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching skills" });
  }
});

app.listen(port ,"0.0.0.0",()=>{
    console.log(`server is up on port http://localhost:${port}`);
    
})