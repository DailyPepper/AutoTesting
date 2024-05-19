const { Builder, Browser, By, until } = require("selenium-webdriver");

class BasePage {
  constructor() {
    this.driver = null;
  }

  async goToUrl(url) {
    this.driver = new Builder().forBrowser(Browser.CHROME).build();
    await this.driver.manage().setTimeouts({ implicit: 5000 });
    await this.driver.get(url);
  }

  async enterText(locator, text) {
    const element = await this.driver.findElement(locator);
    await element.sendKeys(text);
  }

  async getText(locator) {
    const element = await this.driver.findElement(locator);
    return await element.getText();
  }

  async click(locator) {
    const element = await this.driver.findElement(locator);
    await element.click();
  }

  async waitForElement(locator, timeout = 10000) {
    await this.driver.wait(until.elementLocated(locator), timeout);
    return await this.driver.findElement(locator);
  }

  async saveScreenshot(fileName) {
    const screenshot = await this.driver.takeScreenshot();
    require("fs").writeFileSync(fileName, screenshot, "base64");
  }

  async closeBrowser(delay = 0) {
    if (delay) await this.driver.sleep(delay);
    await this.driver.quit();
  }
}

module.exports = BasePage;
