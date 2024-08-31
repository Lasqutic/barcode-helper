const api = 'https://lasqutic.github.io/myLabsJs/fulldb.json';

const productss = [];

fetch(api)
  .then(res => res.json())
  .then(data => {
    products.push(...data);
  })
  .catch(error => console.error('Fetch error:', error));

 document.querySelector('#searchInput').addEventListener('input', function () {
  this.value = this.value.replace(/[^\d]/g, '').slice(0, 4);
}); 

document.addEventListener('click', function(event) {
  if (event.target.closest('.product-list .product-card__content')) {
      const clickedCard = event.target.closest('.product-card__content');
      
      if (clickedCard) {
          const selectedCard = clickedCard.cloneNode(true); 
          const parent = clickedCard.closest('.product-list');
          parent.replaceWith(selectedCard); 
      }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const scanner = new BarcodeScanner();

  scanner.onScan((scannedCode) => {
      console.log("результат сканування:", scannedCode);
  });
});

document.querySelector('#searchButton').addEventListener('click', () => {

  searchProduct()
});

function sortByKey(jsonArray, key) {
  return jsonArray.sort((a, b) => {
    const valueA = parseInt(a[key], 10);
    const valueB = parseInt(b[key], 10);

    return valueA - valueB;
  });
}
const products = sortByKey(productss, 'shortBarcode');
console.log(products)



const jsonFields = [
  {
    key: 'manufacturer',
    render: (value) => createTextElement('product-card__manufacturer', 'Виробник: ', value)
  },
  {
    key: 'volume',
    render: (value) => createTextElement('product-card__volume', 'Об\'єм: ', value)
  }
];

function createTextElement(className, elementTextContent, value) {
  const element = document.createElement('p');
  element.className = className;
  element.textContent = elementTextContent.toString();
  const span = document.createElement('span');
  span.textContent = value;
  element.appendChild(span);
  return element;
}

function findRecordsByKey(jsonData, key, value) {
  return jsonData.filter(record => record[key] === value);
}

function searchProduct() {
  const searchInput = document.querySelector('#searchInput').value;
  const resultDiv = document.querySelector('#page__product-card');
  resultDiv.innerHTML = '';
  resultDiv.replaceChildren();

  const foundProducts = findRecordsByKey(products, 'shortBarcode', searchInput);

  if (foundProducts.length === 1) {
    const productCard = createProductCard(foundProducts[0]);

    resultDiv.appendChild(productCard);
  } else if (foundProducts.length > 1) {
    const productList = document.createElement('div');
    productList.className = 'product-list';

    foundProducts.forEach(product => {
      const productCard = createProductCard(product);
      productList.appendChild(productCard);
    });

    resultDiv.appendChild(productList);
  } else {
    resultDiv.appendChild(createTextElement('error', 'На жаль, не вдалося знайти продукти за вказаним кодом: ', searchInput))

  }
}

function createProductCard(product) {
  const productCard = document.createElement('div');
  productCard.className = 'product-card__content';

  const titleElement = document.createElement('h2');
  titleElement.className = 'product-card__title';
  titleElement.textContent = product.title;
  productCard.appendChild(titleElement);

  const imgElement = document.createElement('img');
  imgElement.src = `https://solo.ua${product.imgLink}`;
  imgElement.alt = 'Фото товару';
  imgElement.className = 'product-card__image';
  imgElement.onerror = function() {
    imgElement.src = 'https://placehold.jp/30/dd6699/ffffff/500x400.png?text=Зображення+не+знайдено'; 
    imgElement.alt = 'Зображення не знайдено';
};
  productCard.appendChild(imgElement);

  productCard.appendChild(createProductInfo(product));

  return productCard;
}

function createProductInfo(product) {

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


  jsonFields.forEach(field => {
    if (product[field.key]) {
      const fieldElement = field.render(product[field.key], product);
      infoElement.appendChild(fieldElement);
    }
  });

  return infoElement;
}


