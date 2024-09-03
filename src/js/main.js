import ProductSearcher from './components/ProductSearcher.js';
import ApiProductLoader from './services/ApiProductLoader.js';
import ProductRenderer from './components/ProductRenderer.js';
import ProductController from './components/ProductController.js';
import BarcodeScanner from './components/BarcodeScanner.js';

document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://lasqutic.github.io/myLabsJs/fulldb.json';
  const searcher = new ProductSearcher(new ApiProductLoader(apiUrl));
  const renderer = new ProductRenderer('#page__product-card');
  const controller = new ProductController(renderer, searcher);

  const barcodeScanner = new BarcodeScanner(document.querySelector('#scanButton'), document.querySelector('.barcode-scanner'));
  barcodeScanner.onScan(barcode => {
    controller.searchProductByBarcode(barcode);
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('.product-list .product-card__content')) {
      const clickedCard = event.target.closest('.product-card__content');
      if (clickedCard) {
        const selectedCard = clickedCard.cloneNode(true);
        const parent = clickedCard.closest('.product-list');
        parent.replaceWith(selectedCard);
      }
    }
  });

  document.querySelector('#searchButton').addEventListener('click', () => {
    controller.searchProductByBarcode(document.querySelector('#searchInput').value)
  })

  document.querySelector('#searchInput').addEventListener('input', function () {
    this.value = this.value.replace(/[^\d]/g, '').slice(0, 4);
  });
});
