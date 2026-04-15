const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test('Deve realizar uma compra completa com sucesso', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const checkoutPage = new CheckoutPage(page);
  
  // Passo 1: Login
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // Passo 2: Adicionar ao carrinho e ir para o checkout
  await productsPage.addBackpackToCart();
  await productsPage.goToCart();
  await page.locator('[data-test="checkout"]').click();

  // Passo 3: Preencher informações e finalizar
  await checkoutPage.fillInformation('Stefany', 'Pasold', '89200-000');
  await checkoutPage.finishPurchase();

  // Passo 4: Validação final (O momento da verdade!)
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});