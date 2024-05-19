const BasePage = require("./basepage");
const { By, Key } = require("selenium-webdriver");

const URL = "https://market.yandex.ru/";

const xpathCatalog = "//button[@class='_30-fz button-focus-ring Hkr1q _1pHod _2rdh3 _3rbM-']";

const xpathCategory = "//li//a[@href='/catalog--geiming/41813350']";
const xpathXbox =
   "//a[@href='/catalog--igrovye-pristavki-xbox/41813471/list?hid=91122&glfilter=12782797%3A17888497%2C15163455%2C15163454%2C15163453%2C15163452%2C16092905']";

const xpathTitles = "//h3[@class='G_TNq _2SUA6 _33utW _13aK2 h29Q2 _1A5yJ']";
const xpathPrices = "//span[@class='_1ArMm']";

const xpathAddFavorites = "//button[@title='Добавить в избранное']";

const xpathRemoveFavorites = "//button[@title='Удалить из избранного']";

const xpathFavoritesList = "//a[@href='/my/wishlist?track=head']";

const xpathSave = "//span[@class='_2rdbx _2SUA6 _33utW IFARr _1A5yJ']";

class YandexMarketPage extends BasePage {
   async openPage() {
      await this.goToUrl(URL);
      await driver.manage().addCookie({
         name: "spravka",
         value: "dD0xNzE0OTI1MDg0O2k9MjEyLjQ2LjEwLjg4O0Q9QkIxMjBCMjA1OUNBMjgxREFCNjRBN0EwNzRBQTRBMTY4RDczQTBCNjQ5QjE5Q0ZFQjgxNUU2RkREM0FBODkzODlFRjAyNUQ4NUZFMEU1RUU5Rjc4RkRDNDI4OTc0ODM5OTY4QUMwREFENzY5QTE5MTNEOURBMkE5RDdFOUU2QTQ2NERDMzREOTFFNTkwOEMwRjc2NTU4NTBEM0VFODA4RTdERThDRTlGNDI5ODQ1RjJBOTBGM0ZBM0I2O3U9MTcxNDkyNTA4NDQzNjA0MTY5MDtoPTg1NzQxN2M1ZjAxZDJkMTc5ZWU1ZDgzMzMyY2I5NGQ3",
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
   // async clickCategory() {
   //    await this.click(By.xpath(xpathCategory));
   // }
   async clickXbox() {
      await this.click(By.xpath(xpathXbox));
   }
   async logElements() {
      const xboxTitles = await driver.findElements(By.xpath(xpathTitles)).slice(0, 5);
      const xboxPrices = await driver.findElements(By.xpath(xpathPrices)).slice(0, 5);
      const arr = xboxTitles.map((el, i) => [el, xboxPrices[i]]);
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
   async getFavorites() {
      const title = await this.click(By.xpath(xpathTitles));
      const price = await this.click(By.xpath(xpathPrices));
      return [title, price];
   }
   async removeFavorites() {
      await this.click(By.xpath(xpathRemoveFavorites));
   }
   async refreshPage() {
      await driver.naviagate.refresh();
   }
   async getSaveText() {
      const elem = await driver.findElement(By.xpath(xpathSave));
      const text = await elem.getText();
      return text
   }
}

module.exports = YandexMarketPage;