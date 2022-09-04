const express = require('express');
const path = require('path')
const fs = require('fs').promises
const { v4: uuid } = require("uuid");

const app = express();

//responsible for turning any incoming request body in type json from text, into the actual data
app.use(express.json())
//turns url encoded characters into their utf-8 variant
app.use(express.urlencoded({
    extended: true
}));

//goes into public folder, looks for any files and creates routes for each of them at the root directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/notes', async (req, res) => {
    //read in text on json file
    const fileContents = await fs.readFile(path.join(__dirname, 'db/db.json'))
    //turned text into data
    const dbJson = JSON.parse(fileContents);
    //sent data back to client that made request
    res.json(dbJson)
})

app.post('/api/notes', async (req, res) => {
    //Because of multiple references to new entry, new variable created.
    const newEntry = {
        title: req.body.title,
        text: req.body.text,
        id: uuid()
    }
    //next two lines are the same as the get request
    const fileContents = await fs.readFile(path.join(__dirname, 'db/db.json'))
    const dbJson = JSON.parse(fileContents);
    //added new entry that was created to the end of data array
    dbJson.push(newEntry)
    //saved data back as text into the file
    await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(dbJson))

    //sent new entry back to client
    res.json(newEntry)
})

//Captures incoming requests to /notes and serves notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

//Captures any incoming get request that hasnt been handled by a previous handler. Serves index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(3000, () => {
    console.log('server is up');
});