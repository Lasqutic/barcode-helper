document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#scanButton').addEventListener('click', () => {
        document.querySelector('#barcodeScanner').classList.toggle('active');
    });

    document.querySelector('#searchButton').addEventListener('click', () => {

        const barcodeElement = document.querySelector('#product-barcode');
        const barcodeText = barcodeElement.textContent;

        if (barcodeText.length > 4) {
            const lastFourDigits = barcodeText.slice(-4);
            const restOfBarcode = barcodeText.slice(0, -4);

            barcodeElement.innerHTML = `${restOfBarcode}<span style="font-weight: bold; color: crimson">${lastFourDigits}</span>`;
        }
    });
    document.querySelector('#product-code').addEventListener('input', function () {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 4);

    });


});