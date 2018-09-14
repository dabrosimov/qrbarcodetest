//Bar code scanner
Quagga.init({
    inputStream : {
        name : 'Live',
        type : 'LiveStream',
        target: '#video-container',
        constraints: {
            width: {min: 640},
            height: {min: 480},
            aspectRatio: {min: 1, max: 100},
            facingMode: 'environment'
        }
    },
    decoder: {
        readers : [{
            format: 'code_128_reader',
            config: {}
        }]
    },
    locator: {
        patchSize: 'medium',
        halfSample: true
    },
    frequency: 10,
    numOfWorkers: 2,
    locate: true
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log('Initialization finished. Ready to start');
    Quagga.start();
});

Quagga.onProcessed(function(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
        }
    }
});

Quagga.onDetected(function(result) {
    var code = result.codeResult.code;
    alert('Barcode:' + code);
});

var stopButton = document.getElementById('stop-button');
stopButton.addEventListener('click', function(e) {
    e.preventDefault();
    Quagga.stop();
});

//Qr code scanner
var video = document.getElementById("video-element");
var canvasElement = document.getElementById("canvas-qr");
var canvas = canvasElement.getContext("2d");

requestAnimationFrame(tick);
function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert"
        });
        if (code) {
            alert('QRcode: ' + code.data);
        }
    }
    requestAnimationFrame(tick);
}