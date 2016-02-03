import $ from 'jquery';

$(function() {
    $('.file-api').html(Modernizr.filereader);
    $('.filesystem-api').html(Modernizr.filesystem || 'false');
    $('.file-input-attr').html(Modernizr.fileinput || 'false');
    $('.file-input-attr').html(Modernizr.fileinput || 'false');
    $('.canvas-api').html(Modernizr.canvas || 'false');
    
    var $inputField = $('#file');

	$inputField.on('change', function (e) {
        console.log('derp');
        
		var file = e.target.files[0];

		if (file) {
			if (/^image\//i.test(file.type)) {
				readFile(file);
			} else {
				alert('Not a valid image!');
			}
		}
	});
    
    function readFile(file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            processFile(reader.result, file.type, file.name);
        }

        reader.onerror = function () {
            alert('There was an error reading the file!');
        }

        reader.readAsDataURL(file);
    }
    
    function processFile(dataURL, fileType, fileName) {
        var maxWidth = 800;
        var maxHeight = 800;

        var image = new Image();
        image.src = dataURL;

        image.onload = function () {
            var width = image.width;
            var height = image.height;
            var shouldResize = (width > maxWidth) || (height > maxHeight);

            if (!shouldResize) {
                sendFile(dataURL);
                return;
            }

            var newWidth;
            var newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            var canvas = document.createElement('canvas');

            canvas.width = newWidth;
            canvas.height = newHeight;

            var context = canvas.getContext('2d');

            context.drawImage(this, 0, 0, newWidth, newHeight);

            dataURL = canvas.toDataURL(fileType);
            
            sendFile(dataURL, fileName);
        };

        image.onerror = function () {
            alert('There was an error processing your file!');
        };
    }

    function sendFile(fileData, fileName) {
        var formData = new FormData();
        var file = dataURLtoBlob(fileData);
        
        formData.append('file', file, fileName);

        $.ajax({
            type: 'POST',
            url: '/upload',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.success) {
                    alert('Your file was successfully uploaded!');
                } else {
                    alert('There was an error uploading your file!');
                }
            },
            error: function (data) {
                alert('There was an error uploading your file!');
            }
        });
    }
    
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }
});


