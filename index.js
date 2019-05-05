const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
var upload = multer({ dest: '../export/' })

app.use(cors());

app.get('/upload', function (req, res) {
    res.send('hello world');
});


app.post('/upload', upload.single('file'), function (req, res, next) {
    console.log(req.file);
    console.log(req.file.originalname.split('.').pop());
  })

app.listen(3001, () => {
  console.log("Server started!");
});