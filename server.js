const express = require('express');
const path = require('path')
const fs = require('fs').promises
const {v4: uuid} = require("uuid");

const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/notes', async (req,res) => {
    const fileContents = await fs.readFile(path.join(__dirname, 'db/db.json'))
    const dbJson = JSON.parse(fileContents);
    res.json(dbJson)
})

app.post('/api/notes', async (req,res) => {
    const newEntry = {
        title:req.body.title,
        text:req.body.text,
        id:uuid()
    }
})

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(3000, () => {
    console.log('server is up');
});