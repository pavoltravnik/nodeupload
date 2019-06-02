const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const fs = require('fs');
const request = require('request');

const { RPC_USERNAME, RPC_PASSWORD, RPC_IPADDRESS='not set', RPC_PORT } = process.env;

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

app.get('/getrawtransaction', function (req, res) {
    const formData = {
        jsonrpc: '1.0',
        id: 'curltext',
        method: 'getblock',
        params: ['07406e4cb9769803c5cf44bd965aaff91452a1d42c92295f1b3b1800f8b9680a'],
    };

    request.post({
        headers: {'content-type' : 'application/json'},
        url:`http://${RPC_USERNAME}:${RPC_PASSWORD}@litecoin:${RPC_PORT}/`,
        formData: formData
    }, function(err, httpResponse, body) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(formData);
    });
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
                return res.status(500).json(err);
            }
            return res.status(200).json(body);
        });
    });
});

app.listen(3000, () => {
  console.log("Server started!");
});