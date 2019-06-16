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


app.get('/getaddressTXs', function (req, res) {
    request('https://api.blockcypher.com/v1/ltc/main/addrs/LeNkYGHa9wkZN88acBh6RnMuDo214xh29G/full?after=1621253', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
      });

});

/*
app.get('/getrawtransaction', function (req, res) {
    const formData = {
        jsonrpc: '1.0',
        id: 'curltext',
        method: 'getrawtransaction',
        params: ['d1a64f587bd21839ff6a3a76f65c43c2ddb06acb40ad9d3f7e8939c7f78260e8'],
    };

    request.post({
        headers: {'content-type' : 'text/plain'},
        url:`http://${RPC_USERNAME}:${RPC_PASSWORD}@litecoin:${RPC_PORT}/`,
        body: JSON.stringify(formData)
    }, function(err, httpResponse, body) {
        if (err) {
            return res.status(500).json(err);
        }

        const bodyParsed = JSON.parse(body);

        if(bodyParsed.result){
            const formData = {
                jsonrpc: '1.0',
                id: 'curltext',
                method: 'decoderawtransaction',
                params: [bodyParsed.result],
            };

            request.post({
                headers: {'content-type' : 'text/plain'},
                url:`http://${RPC_USERNAME}:${RPC_PASSWORD}@litecoin:${RPC_PORT}/`,
                body: JSON.stringify(formData)
            }, function(err, httpResponse, body) {
                if (err) {
                    return res.status(500).json(err);
                }

                return res.status(httpResponse.statusCode).json(body);
            });
        } else {
            return res.status(500).json('Body not parsed.');
        }


    });
});
*/

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