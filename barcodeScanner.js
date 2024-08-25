let isScannerActive = false; 
let videoStream = null;  // Хранит видеопоток камеры

function stopAndHideScanner() {
    if (isScannerActive) {
        Quagga.stop();

        if (videoStream) {
            const tracks = videoStream.getTracks();
            tracks.forEach(track => track.stop());
            videoStream = null; 
        }

        const scannerContainer = document.querySelector('#scannerContainer');
        scannerContainer.style.display = 'none';
        isScannerActive = false;
    }
}

async function startBarcodeScanner() {
    const scannerContainer = document.querySelector('#scannerContainer');
    const scanner = document.querySelector('#scanner');
    const barcodeResult = document.querySelector('#barcodeResult');

    scannerContainer.style.display = 'block';

    return new Promise((resolve, reject) => {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: scanner,
                constraints: {
                    width: 600,
                    height: 300,
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ["ean_reader"]
            }
        }, async function (err) {
            if (err) {
                console.error(err);
                alert("Ошибка инициализации: " + err.name + " - " + err.message);
                stopAndHideScanner(); 
                reject(err);
                return;
            }

            try {
                // Получаем видеопоток для управления вручную
                videoStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                const videoElement = scanner.querySelector('video');
                if (videoElement) {
                    videoElement.srcObject = videoStream;
                }

                Quagga.start();
                isScannerActive = true;
            } catch (err) {
                console.error("Ошибка получения видеопотока:", err);
                stopAndHideScanner();
                reject(err);
            }
        });

        Quagga.onDetected(function (data) {
            const code = data.codeResult.code;
            barcodeResult.textContent = code;

            stopAndHideScanner();  
            resolve(code);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.querySelector('#scanButton');
    const barcodeScanner = document.querySelector('.barcode-scanner');

    scanButton.addEventListener('click', async () => {
        if (isScannerActive) {
            stopAndHideScanner();  
            barcodeScanner.classList.remove('active');
        } else {
            barcodeScanner.classList.add('active');
            try {
                await startBarcodeScanner();
            } catch (error) {
                console.error('Ошибка во время сканирования:', error);
                barcodeScanner.classList.remove('active');
            }
        }
    });
});