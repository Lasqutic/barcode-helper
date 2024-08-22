function startBarcodeScanner() {
    return new Promise((resolve, reject) => {

        const scannerContainer = document.querySelector('#scannerContainer');
        const scanner = document.querySelector('#scanner');
        const barcodeResult = document.querySelector('#barcodeResult');

        scannerContainer.style.display = 'block';
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
        }, function (err) {
            if (err) {
                console.error(err);
                alert("Попилка ініціалізації: " + err.name + " - " + err.message);
                reject(err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function (data) {
            const code = data.codeResult.code;
            barcodeResult.textContent = code;

            Quagga.stop();
            document.querySelector('#scanner-container').style.display = 'none';

            resolve(code);
        });
    });
}
async function handleScanButtonClick() {
    try {
        const scannedCode = await startBarcodeScanner();
        console.log("Сканированный штрих-код сохранен:", scannedCode);

    } catch (err) {
        console.error("Ошибка сканирования:", err);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#scanButton').addEventListener('click', handleScanButtonClick)
});