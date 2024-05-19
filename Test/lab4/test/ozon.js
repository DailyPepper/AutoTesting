const OzonPage = require("./page/marketpage");
const mocha = require("mocha");
const { assert } = require("chai");
const { allure } = require("allure-mocha/dist/MochaAllureReporter");

const withErrorHandling = (fn, handler) => {
   return async () => {
      try {
         await fn();
      } catch (error) {
         console.error("Error occurred:", error);
         await handler();
      }
   };
};

mocha.describe("Ozon test", async () => {
   const ozonPage = new OzonPage();

   before(async () => {
      await ozonPage.openPage();
   });

   after(async () => {
      await ozonPage.closeBrowser();
   });

   afterEach(async function () {
      if (this.currentTest.state === "failed") {
         let dateTime = new Date().toLocaleDateString();
         await ozonPage.saveScreenshot(`error_${dateTime}.png`);
      }
   });

   it(
      "open xbox page",
      withErrorHandling(
         async () => {
            await allure.step("open category", async () => {
               await ozonPage.clickCatalogButton();
               await ozonPage.hoverCategory();
               await ozonPage.clickPhone();
            });
         },
         async () => await ozonPage.saveScreenshot("error.png"),
      ),
   );

   let firstElem;
   it(
      "log titles and prices xbox page",
      withErrorHandling(
         async () => {
            await allure.step("log elems", async () => {
               firstElem = await ozonPage.logElements()[0];
            });
         },
         async () => await ozonPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "add to favorites",
      withErrorHandling(
         async () => {
            await allure.step("add to favorites", async () => {
               await ozonPage.addFavorites();
            });
         },
         async () => await ozonPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "open favorites",
      withErrorHandling(
         async () => {
            await allure.step("open favorites", async () => {
               await ozonPage.openFavorites();
            });
         },
         async () => await ozonPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "remove favorites",
      withErrorHandling(
         async () => {
            await allure.step("remove favorites", async () => {
               await ozonPage.removeFavorites();
            });
         },
         async () => await ozonPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "check favorite",
      withErrorHandling(
         async () => {
            await allure.step("check favorite", async () => {
               const [title, price] = await ozonPage.getFavorite();
               assert.equal(title, firstElem[0]);
               assert.equal(price, firstElem[1]);
            });
         },
         async () => await ozonPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "refresh page",
      withErrorHandling(
         async () => {
            await allure.step("refresh page", async () => {
               assert.equal(await ozonPage.getSaveText(), "Сохраняйте здесь товары");
               await ozonPage.refreshPage();
            });
         },
         async () => await ozonPage.saveScreenshot("error.png"),
      ),
   );
});
