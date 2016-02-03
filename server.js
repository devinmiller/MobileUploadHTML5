var express = require('express');
var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' })

var app = express();
var port = process.env.PORT || 1337;

app.use(express.static('public'));
app.use('/photo', upload);


// app.post('/photo', upload.single('photo'), function (req, res, next) {
//     console.log(req);
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//     res.send({ success: true});
// })

app.listen(port, () => console.log('Listening on port ' + port));