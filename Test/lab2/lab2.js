const { Builder, By, Key, until } = require('selenium-webdriver');

class MosPolytechPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://mospolytech.ru/obuchauschimsya/raspisaniya/';
    this.watchOnSiteLink = By.css('.button-group .btn.text-button');
    this.groupInput = By.css('.header-search.search input.groups');
    this.searchResults = By.css('.col-xs-6.col-sm-4.col-md-3.col-lg-2.group');
  }

  async open() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(this.watchOnSiteLink));
  }

  async clickWatchOnSiteLink() {
    const watchOnSiteLink = await this.driver.findElement(this.watchOnSiteLink);
    await watchOnSiteLink.click();
  }
  
  async searchGroup(groupNumber) {
    const groupInput = await this.driver.wait(until.elementLocated(this.groupInput), 10000); // Явное ожидание
    await groupInput.sendKeys(groupNumber, Key.RETURN);
    await this.driver.wait(until.elementLocated(this.searchResults), 10000); 
  }


  async clickSearchResult() {
    const searchResult = await this.driver.findElement(this.searchResults);
    await searchResult.click();
  }
  
  async runTest() {
    try {
      await this.open();
      await this.clickWatchOnSiteLink();
      await this.searchGroup('221-322');
      await this.clickSearchResult();
      console.log("All steps executed successfully!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await this.driver.quit();
    }
  }
}

async function run() {
  let driver = await new Builder().forBrowser('chrome').build();
  let mosPolytechPage = new MosPolytechPage(driver);
  await mosPolytechPage.runTest();
}

run()
