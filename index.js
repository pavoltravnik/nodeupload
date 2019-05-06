const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const { exec } = require('child_process');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

app.use(cors());

app.get('/upload', function (req, res) {
    res.send('hello world');
});

app.post('/upload',function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
    const data = new FormData();
    data.append('file', req.file);
    fetch('http://localhost:5001/api/v0/add', {
        method: 'POST',
        body: data
      })
      .then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', JSON.stringify(response)));
    return res.sendStatus(200);
    });
});

app.listen(3000, () => {
  console.log("Server started!");
});