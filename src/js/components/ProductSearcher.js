export default class ProductSearcher {
  constructor(productLoader) {
    this.productLoader = productLoader;
    this.products = [];
  }

  async loadAndSearchByBarcode(barcode) {

    this.products = await this.productLoader.loadProducts();
    return barcode.length === 13 
    ? this.#findByBarcode(barcode) 
    : this.#findByShortBarcode(barcode);
  }


  #findByKey(key, value) {
    return this.products.filter(product => product[key] === value);
  }

  #findByShortBarcode(shortBarcode) {
    return this.#findByKey('shortBarcode', shortBarcode);
  }

  #findByBarcode(barcode) {
    return this.#findByKey('barcode', barcode);
  }
}