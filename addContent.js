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

})