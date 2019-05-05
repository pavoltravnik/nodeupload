const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/home/dockeruser/export')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage })

app.use(cors());

app.get('/upload', function (req, res) {
    res.send('hello world');
});

app.post('/upload', upload.single('file'), function (req, res, next) {
    console.log(req.file);
    console.log(req.file.originalname.split('.').pop());
    res.send(200);
  })

app.listen(3000, () => {
  console.log("Server started!");
});