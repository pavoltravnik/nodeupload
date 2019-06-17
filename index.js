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


app.post('/aaa', function (req, res) {
    res.send('POST request to the homepage')
  })

//BlockCypher
app.post('/getaddressTXs', function (req, res) {
    res.send('POST request to homepage');
    /*
    request('https://api.blockcypher.com/v1/ltc/main/addrs/LeNkYGHa9wkZN88acBh6RnMuDo214xh29G/full?after=1611253', function (error, response, body) {
        if (error) {
            return res.status(500).json(error);
        }
        console.log(req);
        const op_returns = JSON.parse(body).txs.filter(tx => tx.inputs.some(input => input.addresses.includes('LYrNwwF5T6dfoFEMPttf6ZVQ3bdkK79w4w'))).map(tx => tx.outputs.map(output => output.hasOwnProperty("data_string") === true ? output.data_string : null))[0];
        return res.status(response.statusCode).json(JSON.parse({}));
      });
    */

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