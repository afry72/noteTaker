// Import Express.js
const express = require('express');
const fs = require('fs');
const util = require('util');
//promisifying the readfile and writefile functions from the fs module
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);




// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

// Static middleware pointing to the public folder
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this function will parse data and throw an error if there is a problem 
const readNotes = async () => {
  try {
    const data = await readFileAsync("./db/db.json", 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error in reading notes:', error);
    throw error;
  }
};

// read and write calls the readfile and writefile consts with the appropriate 
const read = () => {
  return  readFileAsync("./db/db.json", 'utf8');
};

const write = (note) => {
  return  writeFileAsync("./db/db.json", note);
};
 
const readAndAppend = async () => {
  //console.log("read function");
  const notes = await read();
  //console.log(notes, "async here");
  const parsedData = JSON.parse(notes);
  //console.log(parsedData);
  return parsedData;
    
};

const writeToFile = async (content) => {
  const note = await write(content)  
}
  
// Create Express.js routes for default '/', '/send' and '/routes' endpoints
app.get('/', (req, res) => res.send('Navigate to /notes or /index'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
// pulling from json and displaying it on the html
app.get('/api/notes', (req, res) => {
  //console.log("api notes");
  readAndAppend("./db/db.json").then ((parsedData) => {
    //console.log(parsedData, "came here");
    return res.json(parsedData);
  })
});
//post route that takes data and sends it to the server 
app.post('/api/notes', async (req, res) => {
  try {
    console.info(`${req.method} request received to add a note`);

    const data = await read();
    const notes = JSON.parse(data);

    const newNote = { ...req.body, id: notes.length + 1 };

    notes.push(newNote);

    await write(JSON.stringify(notes));

    res.status(201).json({
      status: 'success',
      body: newNote,
    });
  } catch (error) {
    console.error('Error in adding note:', error);
    res.status(500).json({ error: 'Error in adding note' });
  }
});

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await readNotes();
    
    res.json(notes);
  } catch (error) {
    console.error('Error in getting notes:', error);
    res.status(500).json({ error: 'Error in getting notes' });
  }
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`noteTaker is running at http://localhost:${PORT}`)
);
