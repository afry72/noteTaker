// Import Express.js
const express = require('express');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

// Static middleware pointing to the public folder
app.use(express.static('public'));

const read = () => {
  return  readFileAsync("./db/db.json", 'utf8');
};
 
const readAndAppend = async () => {
  console.log("read function");
  const notes = await read();
  console.log(notes, "async here");
  const parsedData = JSON.parse(notes);
  console.log(parsedData);
  return parsedData;
    
};

// Create Express.js routes for default '/', '/send' and '/routes' endpoints
app.get('/', (req, res) => res.send('Navigate to /notes or /index'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  console.log("api notes");
  readAndAppend("./db/db.json").then ((parsedData) => {
    console.log(parsedData, "came here");
    return res.json(parsedData);
  })
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`noteTaker is running at http://localhost:${PORT}`)
);
