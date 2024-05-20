const { Builder, By, until } = require('selenium-webdriver');
const { assert } = require('chai');

class TodoPage {
  constructor(driver) {
    this.driver = driver;
    this.BASE_URL = "https://lambdatest.github.io/sample-todo-app";
    this.titleSelector = By.css("h2");
    this.remainingSelector = By.className("ng-binding");
    this.todoItemSelector = By.css("ul li");
    this.checkboxSelector = By.css("input[type=checkbox]");
    this.spanSelector = By.css("span");
    this.todoTextInput = By.id("sampletodotext");
    this.addButton = By.id("addbutton");
  }

  async open() {
    await this.driver.get(this.BASE_URL);
    await this.driver.manage().window().maximize();
    await this.driver.sleep(1000);
  }

  async getTitleText() {
    const element = await this.driver.findElement(this.titleSelector);
    return await element.getText();
  }

  async getRemainingText() {
    const element = await this.driver.findElement(this.remainingSelector);
    return await element.getText();
  }

  async findNthCheckbox(n) {
    return await this.driver.findElement(By.css(`ul li:nth-child(${n}) input[type=checkbox]`));
  }

  async clickCheckbox(checkbox) {
    await checkbox.click();
  }

  async getSpanClass(checkbox) {
    const span = await checkbox.findElement(By.xpath("following-sibling::*[1]"));
    return await span.getAttribute("class");
  }

  async addNewItem(text) {
    await this.driver.findElement(this.todoTextInput).sendKeys(text);
    await this.driver.findElement(this.addButton).click();
  }
}

describe('Todo Page Tests', () => {
  let driver;
  let page;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    page = new TodoPage(driver);
    await page.open();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('should have correct page title', async () => {
    assert.strictEqual(await page.getTitleText(), "LambdaTest Sample App");
  });

  it('should display correct remaining text', async () => {
    assert.strictEqual(await page.getRemainingText(), "5 of 5 remaining");
  });

  it('should toggle checkboxes correctly', async () => {
    const todoItems = await driver.findElements(page.todoItemSelector);
    for (let todoItem of todoItems) {
      const checkbox = await todoItem.findElement(page.checkboxSelector);
      const spanClass = await todoItem.findElement(page.spanSelector).getAttribute("class");
      assert.strictEqual(spanClass, "done-false");
      await page.clickCheckbox(checkbox);
      assert.strictEqual(await todoItem.findElement(page.spanSelector).getAttribute("class"), "done-true");
    }
  });

  it('should add new item correctly', async () => {
    const newItem = "Six Item";
    console.log("Adding new item...");
    await page.addNewItem(newItem);
    console.log("New item added.");
    await driver.wait(async () => {
      const remainingText = await page.getRemainingText();
      return remainingText === "6 of 6 remaining";
    }, 5000, "Text of remaining tasks didn't update to '6 of 6 remaining'");
    
    console.log("Updated remaining text:", await page.getRemainingText());
    const addedCheckbox = await page.findNthCheckbox(6);
    assert.strictEqual(await addedCheckbox.getAttribute("checked"), null);
    assert.strictEqual(await page.getSpanClass(addedCheckbox), "done-false");
    assert.strictEqual(await page.getRemainingText(), "6 of 6 remaining");
    await page.clickCheckbox(addedCheckbox);
    assert.strictEqual(await addedCheckbox.getAttribute("checked"), "true");
    assert.strictEqual(await page.getSpanClass(addedCheckbox), "done-true");
    assert.strictEqual(await page.getRemainingText(), "5 of 6 remaining");
  });
});
