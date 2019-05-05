const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');

var upload = multer({ dest: 'uploads/' }).single('file');

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
    return res.sendStatus(200);
    });
});

app.listen(3000, () => {
  console.log("Server started!");
});