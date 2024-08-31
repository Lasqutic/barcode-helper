class BarcodeScanner {
    #isScannerActive = false;
    #isProcessing = false;
    #barcodeScannerElement;
    #scanButton;
    #timeoutId;

    constructor(scanButton, barcodeScannerElement) {
        this.#barcodeScannerElement = barcodeScannerElement//= document.querySelector('.barcode-scanner');
        this.#scanButton = scanButton; //document.querySelector('#scanButton');
        this.#init();
    }

    #init() {
        this.#scanButton.addEventListener('click', async () => {
            if (this.#isProcessing) {

                this.#scanButton.disabled = true;
                return; // Prevent multiple clicks to avoid initializing video streams multiple times.
            } 
            this.#isProcessing = true;

            if (this.#isScannerActive) {
                this.#stopAndHideScanner();
            } else {
                await this.#showAndStartScanner();
            }

            setTimeout(() => {
                this.#isProcessing = false;
                this.#scanButton.disabled = false
               
            }, 2000); // Delay before re-enabling clicks
        });
    }

    async #showAndStartScanner() {
        this.#barcodeScannerElement.classList.add('active');
        this.#barcodeScannerElement.style.display = 'block';

        try {
            await this.#startScanner();

            // Set a n-second timer to automatically turn off the camera if something goes wrong.
            this.#timeoutId = setTimeout(() => {
                this.#stopAndHideScanner();
                alert('Час використання камери сплив. Спробуйте повторно відсканувати.');
            }, 40000);
        } catch (error) {
            alert("Помилка під час запуску сканера: " + error.message);
            console.error('Помилка під час запуску сканера: ', error.message);
            this.#stopAndHideScanner();
        }
    }

    #stopAndHideScanner() {
        if (this.#isScannerActive) {
            this.#stopScanner();
            this.#isScannerActive = false;
        }

        this.#barcodeScannerElement.classList.remove('active');

        if (this.#timeoutId) {
            clearTimeout(this.#timeoutId);
            this.#timeoutId = null;
        }
    }

    #stopScanner() {
        Quagga.stop();
    }

    async #startScanner() {
        const scanner = document.querySelector('#scanner');

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
            }, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                Quagga.start();
                this.#isScannerActive = true;
                resolve();
            });

            Quagga.onDetected((data) => {
                const code = data.codeResult.code;
                console.log("Код обнаружен:", code);
                this.#stopAndHideScanner();
            });
        });
    }

    get isActive() {
        return this.#isScannerActive;
    }

    onScan(callback) {
        Quagga.onDetected((data) => {
            const code = data.codeResult.code;
            this.#stopAndHideScanner();
            callback(code);
        });
    }
}
