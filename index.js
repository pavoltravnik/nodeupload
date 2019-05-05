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
    exec('docker exec ipfs_host ipfs add /export/'+req.file.filename)
        .then(a => console.log(a))
        .catch(err => console.log(err));
    return res.sendStatus(200);
    });
});

app.listen(3000, () => {
  console.log("Server started!");
});