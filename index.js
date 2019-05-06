const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const fs = require('fs');
const request = require('request');

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

        const formData = {
            file: fs.createReadStream(req.file.path),
        };

        request.post({url:'http://ipfs_host:5001/api/v0/add', formData: formData}, function(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log('Upload successful!  Server responded with:', body);
            return res.status(200).json(body);
        });

    return res.status(200).json({a: 1});
    });
});

app.listen(3000, () => {
  console.log("Server started!");
});