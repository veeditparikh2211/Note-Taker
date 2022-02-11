const express = require('express');
const database = require('./db/db.json');


const PORT = process.env.PORT || 3001;
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", function(req, res) {

    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", function(req, res) {

    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// get route

app.get("/api/notes", (req, res) => {

    //console.log(res.json(database));
    return res.json(database);
});


// post route

app.post("/api/notes", (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);

    req.body.id = JSON.stringify(database.length + 1);

    const newnote = createNewdata(req.body, database);

    res.json(newnote);
});

// delete route

app.delete("/api/notes/:id", (req, res) => {

    const id = req.params.id;

    deleteNote(id, database);

    return res.json(true);

});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// POST function

function createNewdata(body, notesArray) {

    console.log("body : ", body);
    console.log("notesArray : ", notesArray);
    const newnote = body;
    notesArray.push(body);
    fs.writeFileSync(
        path.join(__dirname, "db/db.json"),
        JSON.stringify(notesArray));
    console.log(newnote);
    return newnote;
}

// DELETE function

function deleteNote(id, notesArray) {
    for (var i = 0; i < database.length; i++) {

        var note = notesArray[i];
        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, "db/db.json"),
                JSON.stringify(notesArray));

            break;
        }
    }
}