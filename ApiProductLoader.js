import { ProductLoader } from './ProductLoader.js';

export default class ApiProductLoader extends ProductLoader {
  constructor(apiUrl) {
    super();
    this.apiUrl = apiUrl;
  }

  async loadProducts() {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch. Response not successful received status code: ${response.status}`);
    }
    return await response.json();
  }
}

