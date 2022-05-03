const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid')

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, notes) =>{
        if(err){
            console.log("Error reading data");
        }
        else{
            return res.json(JSON.parse(notes));
        }
    })
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (req.body){
    const note = {
      title,
      text,
      id: uuid()
    }
    fs.readFile('./db/db.json', (err, data) => {
      if(err){
        console.log(err);
      }
      else{
        const notes = JSON.parse(data);
        notes.push(note);
        fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
          if(err){
            console.log(err);
          }
        });
      }
    });
    return res.json("Success");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
