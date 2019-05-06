const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');
const http = require('http');


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
    data.append('my_file', fs.createReadStream(req.file.path));

    data.submit('http://ipfs_host:4001/upload', function(err, res) {
        console.log(err);
        res.resume();
    });

    return res.sendStatus(200);
    });
});

app.listen(3000, () => {
  console.log("Server started!");
});