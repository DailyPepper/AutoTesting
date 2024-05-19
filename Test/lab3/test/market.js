const YandexMarketPage = require("./page/marketpage");
const mocha = require("mocha");
const { assert } = require("chai");
const { allure } = require("allure-mocha/dist/MochaAllureReporter");

const withErrorHandling = (fn, handler) => {
   return async () => {
      try {
         await fn();
      } catch (error) {
         console.error.png(error);
         handler();
      }
   };
};

mocha.describe("YandexMarket test", async () => {
   const yandexMarketPage = new YandexMarketPage();

   before(async () => {
      await yandexMarketPage.openPage();
   });

   after(async () => {
      await yandexMarketPage.closeBrowser();
   });

   afterEach(async function () {
      if (this.currentTest.state == "failed") {
         let dateTime = new Date().toLocaleDateString();
         await yandexMarketPage.saveScreenshot(dateTime);
      }
   });

   it(
      "open xbox page",
      withErrorHandling(
         await allure.step("open category", async () => {
            await yandexMarketPage.clickCatalogButton();
            await yandexMarketPage.hoverCategory();
            await yandexMarketPage.clickXbox();
         }),
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );
   let firstElem;
   it(
      "log titles and prices xbox page",
      withErrorHandling(
         await allure.step("log elems", async () => {
            firstElem = await yandexMarketPage.logElements()[0];
         }),
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "add to favorites",
      withErrorHandling(
         await allure.step("add to favorites", async () => {
            await yandexMarketPage.addFavorites();
         }),
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "open favorites",
      withErrorHandling(
         await allure.step("open favorites", async () => {
            await yandexMarketPage.openFavorites();
         }),
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "remove favorites",
      withErrorHandling(
         await allure.step("remove favorites", async () => {
            await yandexMarketPage.removeFavorites();
         }),
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "check faovrite",
      withErrorHandling(
         await allure.step("remove favorites", async () => {
            const [title, price] = await yandexMarketPage.getFavorite();
            assert.equal(title, firstElem[0]);
            assert.equal(title, firstElem[1]);
         }),
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );
   it(
      "refresh page",
      withErrorHandling(
         await allure.step("remove favorites", async () => {
            assert.equal(await yandexMarketPage.getSaveText(), "Сохраняйте здесь товары");
            await yandexMarketPage.refreshPage();
         }),
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );
});