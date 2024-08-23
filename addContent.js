const api = 'https://lasqutic.github.io/myLabsJs/fulldb.json';

const products = [];

fetch(api)
  .then(res => res.json())
  .then(data => {
    products.push(...data); // Используем spread-оператор для добавления элементов в массив
    console.log('products>>>>', products);
  })
  .catch(error => console.error('Fetch error:', error));

function findRecordsByKey(jsonData, key, value) {
  return jsonData.filter(record => record[key] === value);
}

document.addEventListener('DOMContentLoaded', () => {

  const inputField = document.querySelector('#product-code');
  const image = document.querySelector('#product-image');
  const title = document.querySelector('#product-title');
  const barcode = document.querySelector('#product-barcode');
  const manufacturer = document.querySelector('#product-manufacturer');
  const pageUrl = document.querySelector('#product-url');

  /* const fields = [
    { key: 'manufacturer', render: (value) => `<p>Цена: ${value}</p>` },
    { key: 'expiryDate', render: (value) => `<p>Срок годности: ${value}</p>` },
    { key: 'image', render: (value, product) => `<img src="${value}" alt="${product.name}">` }
]; */

  inputField.value = '';

  document.querySelector('#searchButton').addEventListener('click', () => {

    const errorMessage = document.querySelector('#search__error');
    const productDetails2 = findRecordsByKey(products, 'shortBarcode', inputField.value);
    const [productDetails] = productDetails2;
    console.log(productDetails2);

    if (!!productDetails) {
      inputField.value = '';
      errorMessage.textContent = '';

      title.textContent = productDetails.title
      image.src = `https://solo.ua${productDetails.imgLink}`;
      barcode.textContent = productDetails.barcode;
      pageUrl.href = productDetails.pageUrl;
      manufacturer.textContent = productDetails.manufacturer;

    } else {

      title.textContent = '';
      image.src = '';
      barcode.textContent = '';
      pageUrl.href = '';
      manufacturer.textContent = '';

      errorMessage.textContent = `Жодного продукту з цим кодом не знайдено: «${inputField.value}»`;
      inputField.value = '';

    }
  })

  document.querySelector('#searchButton').addEventListener('click', () => {



  });

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
    productCard.className = 'product-card';


    productCard.appendChild(createProductInfo(product));

    return productCard;
  }

  function createProductInfo(product) {

    const titleElement = document.createElement('h2');
    titleElement.className = 'product-card__title';
    titleElement.textContent = product.title;

    const infoElement = document.createElement('div');
    infoElement.className = 'product-card__info';

    const imgElement = document.createElement('img');
    imgElement.src = `https://solo.ua${product.imgLink}`;
    imgElement.alt = 'Фото товару';
    imgElement.className = 'product-card__image';
    infoElement.appendChild(imgElement);

    const barcodeElement = document.createElement('p');
    barcodeElement.className = 'product-card__barcode';
    barcodeElement.textContent = 'Код товара: ';
    barcodeElement.insertAdjacentHTML('beforeend', `<span>${product.barcode}</span>`);
    infoElement.appendChild(barcodeElement);


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

})