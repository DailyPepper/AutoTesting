const BasePage = require("./basepage");
const { By, Key, WebDriver } = require("selenium-webdriver");

const URL = "https://www.ozon.ru/";

const xpathCatalog = "//button[@class='b213-a0 b213-b5']";

const xpathCategory = "//li//a[@href='/category/elektronika-15500']";
const xpathPhone =
   "//a[@href='/category/telefony-i-smart-chasy-15501']";

const xpathTitles = "//a[@href='/category/smartfony-15502']";
const xpathPrices = "//span[@class='_1ArMm']";

const xpathAddFavorites = "//button[@title='Добавить в избранное']";

const xpathRemoveFavorites = "//button[@title='Удалить из избранного']";

const xpathFavoritesList = "//a[@href='/favorites']";
const xpathSave = "//div[@class='_2ml5u']";

class OzonPage extends BasePage {
   async openPage() {
      await this.goToUrl(URL);
      await driver.manage().addCookie({
         name: "spravka",
         value: "dD0xNzE0OTI1MDg0O2k9MjEyLjQ2LjEwLjg4O0Q9QkIxMjBCMjA1OUNBMjgxREFCNjRBN0EwNzRBQTRBMTY4RDczQTBCNjQ5QjE5Q0ZFQjgxNUU2RkREM0FBODkzODlFRjAyNUQ4NUZFMEU1RUU5Rjc4RkRDNDI4OTc0ODM5OTY4QUMwREFENzY5QTE5MTNEOURBMkE5RDdFOUU2QTQ2NERDMzREOTFFNTkwOEMwRjc2NTU4NDBEM0VFODA4RTdERThDRTlGNDI5ODQ1RjJBOTBGM0ZBM0I2O3U9MTcxNDkyNTA4NDQzNjA0MTY5MDtoPTg1NzQxN2M1ZjAxZDJkMTc5ZWU1ZDgzMzMyY2I5NGQ3",
      });
      await this.goToUrl(URL);
   }
   async clickCatalogButton() {
      await this.click(By.xpath(xpathCatalog));
   }
   async hoverCategory() {
      await driver
         .actions()
         .mouseMove(await driver.findElement(By.xpath(xpathCategory)))
         .perform();
      await driver.sleep(2000);
   }
   async clickPhone() {
      await this.click(By.xpath(xpathPhone));
   }
   async logElements() {
      const xboxTitles = await driver.findElements(By.xpath(xpathTitles)).slice(0, 5);
      const xboxPrices = await driver.findElements(By.xpath(xpathPrices)).slice(0, 5);
      const arr = await Promise.all(xboxTitles.map(async (el, i) => [await el.getText(), await xboxPrices[i].getText()]));
      for (let i of arr) {
         console.log(i[0], i[1]);
      }
      return arr;
   }
   async addFavorites() {
      await this.click(By.xpath(xpathAddFavorites));
   }
   async openFavorites() {
      await this.click(By.xpath(xpathFavoritesList));
   }
   async getFavorite() {
      const title = await this.getText(By.xpath(xpathTitles));
      const price = await this.getText(By.xpath(xpathPrices));
      return [title, price];
   }
   async removeFavorites() {
      await this.click(By.xpath(xpathRemoveFavorites));
   }
   async refreshPage() {
      await driver.navigate().refresh();
   }
   async getSaveText() {
      const elem = await driver.findElement(By.xpath(xpathSave));
      const text = await elem.getText();
      return text
   }
}

module.exports = OzonPage;
