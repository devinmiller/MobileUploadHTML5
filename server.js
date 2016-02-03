var express = require('express');
var multer  = require('multer')
var path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

var upload = multer({ storage: storage });

var app = express();
var port = process.env.PORT || 1337;

app.use(express.static('public'));

app.post('/upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.send({ success: true});
})

app.listen(port, () => console.log('Listening on port ' + port));