export default class ProductRenderer {
    #productFields = [
        {
            key: 'manufacturer',
            render: (value) => this.#createTextElement('product-card__manufacturer', 'Виробник: ', value)
        },
        {
            key: 'volume',
            render: (value) => this.#createTextElement('product-card__volume', 'Об\'єм: ', value)
        }
    ];

    constructor(resultDivSelector) {
        this.resultDiv = document.querySelector(resultDivSelector);
    }

    renderSingleProduct(product) {
        this.#clearResults();
        this.resultDiv.appendChild(this.#createProductCard(product));
    }

    renderProductList(products) {
        this.#clearResults();
        const productList = document.createElement('div');
        productList.className = 'product-list';

        products.forEach(product => {
            productList.appendChild(this.#createProductCard(product));
        });

        this.resultDiv.appendChild(productList);
    }

    renderError(message) {
        this.#clearResults();
        this.resultDiv.appendChild(this.#createTextElement('error', message));
    }

    #clearResults() {
        this.resultDiv.innerHTML = '';
    }
//TODO: Implement image list rendering
    #createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card__content';

        const titleElement = document.createElement('h2');
        titleElement.className = 'product-card__title';
        titleElement.textContent = product.title;
        productCard.appendChild(titleElement);

        const imgElement = document.createElement('img');
        imgElement.src = product.imgUrls[0];
        imgElement.alt = 'Фото товару';
        imgElement.className = 'product-card__image';
        imgElement.onerror = function () {
            imgElement.src = 'https://placehold.jp/30/dd6699/ffffff/500x400.png?text=Зображення+не+знайдено';
            imgElement.alt = 'Зображення не знайдено';
        };
        productCard.appendChild(imgElement);

        productCard.appendChild(this.#createProductInfo(product));

        return productCard;
    }

    #createProductInfo(product) {

        const infoElement = document.createElement('div');
        infoElement.className = 'product-card__info';

        const barcodeElement = document.createElement('p');
        barcodeElement.className = 'product-card__barcode';
        barcodeElement.textContent = 'Код товара: ';

        const barcodeSpan = document.createElement('span')
        barcodeSpan.textContent = product.barcode.slice(0, -4);
        const shortBarcodeSpan = document.createElement('span');
        shortBarcodeSpan.className = 'highlight-text';
        shortBarcodeSpan.textContent = product.shortBarcode;

        barcodeElement.appendChild(barcodeSpan);
        barcodeElement.appendChild(shortBarcodeSpan);
        infoElement.appendChild(barcodeElement)


        const linkElement = document.createElement('a');
        linkElement.href = product.pageUrl;
        linkElement.className = 'product-card__url';
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.textContent = 'Посилання на продукт';
        infoElement.appendChild(linkElement);


        this.#productFields.forEach(field => {
            if (product[field.key]) {
                const fieldElement = field.render(product[field.key], product);
                infoElement.appendChild(fieldElement);
            }
        });

        return infoElement;
    }

    #createTextElement(className, elementTextContent, value) {
        const element = document.createElement('p');
        element.className = className;
        element.textContent = elementTextContent.toString();
        const span = document.createElement('span');
        span.textContent = value;
        element.appendChild(span);
        return element;
    }
}
