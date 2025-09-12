import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
``

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

app.listen(port ,"0.0.0.0",()=>{
    console.log(`server is up on port http://localhost:${port}`);
    
})