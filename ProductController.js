export default class ProductController {
  constructor(renderer, searcher) {

    this.renderer = renderer;
    this.searcher = searcher;
  }

  async searchProductByBarcode(barcode) {
    try {
      const products = await this.searcher.loadAndSearchByBarcode(barcode);
      if (!barcode) {
        this.renderer.renderError('Поле Input не повинно бути пустим. Введіть останні чтотири цифри штрих-коду');
      }
      else if (products.length === 0) {
        this.renderer.renderError(`Продукт з таким кодом "${barcode}" не знайдено`);
      } else if (products.length === 1) {
        this.renderer.renderSingleProduct(products[0]);
      } else {
        this.renderer.renderProductList(products);
      }
    } catch (error) {
      this.renderer.renderError(`Помилка: ${error.message}`);
    }
  }
}
