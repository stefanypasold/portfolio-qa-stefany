class ProductsPage {
  constructor(page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.backpackAddToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  async addBackpackToCart() {
    await this.backpackAddToCartBtn.click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }
}

module.exports = { ProductsPage };