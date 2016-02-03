var express = require('express');
var busboy  = require('busboy')
var path = require('path');
var azure = require('azure-storage');

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     }
// });
// 
// var upload = multer({ storage: storage });

var app = express();
var port = process.env.PORT || 1337;

app.use(express.static('public'));

app.get('/upload', function(req,res, next) {
    var service = azure.createBlobService();
    
    service.createContainerIfNotExists('mobile-uploads', { publicAccessLevel : 'blob' }, function(err, result, response) {
        if(!err) {
            service.listBlobsSegmented('mobile-uploads', null, function(err, result, response){
                if(!err){
                    console.log(result.entries);
                    // result.entries contains the entries
                    // If not all blobs were returned, result.continuationToken has the continuation token.
                    res.send({ success: true, entries: result.entries});
                }
            });
        }
    });
});

app.post('/upload', function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    var service = azure.createBlobService();
    
    service.createContainerIfNotExists('mobile-uploads', { publicAccessLevel : 'blob' }, function(err, result, response) {
        if(!err) {
            var fileUpload = new busboy({ headers: req.headers });
            
            fileUpload.on('file', function(fieldname, file, filename, encoding, mimetype) {
                console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
                file.pipe(service.createWriteStreamToBlockBlob('mobile-uploads', `${Date.now()}-${filename}`));
            });
            
            fileUpload.on('finish', function() {
                //res.writeHead(200, { 'Connection': 'close' });
                res.send({ success: true});
            });
            
            return req.pipe(fileUpload);
        }
    });
})

app.listen(port, () => console.log('Listening on port ' + port));