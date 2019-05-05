const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');

app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname );
  }
});

const upload = multer({ storage: storage }).single('file');

app.get('/upload', function (req, res) {
    res.send('hello world')
});

app.post('/upload',function(req, res) {

    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});

app.listen(3000, () => {
  console.log("Server started!");
});