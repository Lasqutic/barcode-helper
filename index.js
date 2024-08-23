const api = 'https://lasqutic.github.io/myLabsJs/fulldb.json';

const products = [];

fetch(api)
  .then(res => res.json())
  .then(data => {
    products.push(...data);
    console.log('products>>>>', products);
  })
  .catch(error => console.error('Fetch error:', error));



document.querySelector('#scanButton').addEventListener('click', () => {
  document.querySelector('#barcodeScanner').classList.toggle('active');
});
/* document.querySelector('#searchInput').addEventListener('input', function () {
  this.value = this.value.replace(/[^\d]/g, '').slice(0, 4);

}); */


document.querySelector('#searchButton').addEventListener('click', () => {

  searchProduct()
});



const fields = [
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
    resultDiv.innerHTML = '<p class="error">Продукты не найдены</p>';
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


  fields.forEach(field => {
    if (product[field.key]) {
      const fieldElement = field.render(product[field.key], product);
      infoElement.appendChild(fieldElement);
    }
  });

  return infoElement;
}


