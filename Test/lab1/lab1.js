const assert = require('assert');
const { Builder, By, Key, until } = require('selenium-webdriver');

async function runTests() {
  let driver;
  try {
    driver = await new Builder().forBrowser('chrome').build();
    
    const BASE_URL = "https://lambdatest.github.io/sample-todo-app";

    async function findNthCheckbox(driver, n) {
        return await driver.findElement(By.css(`ul li:nth-child(${n}) input[type=checkbox]`));
    }

    async function getTextRemaining(driver) {
        return await driver.findElement(By.className("ng-binding")).getText();
    }

    await driver.get(BASE_URL);
    await driver.manage().window().maximize();
    await driver.sleep(1000);

    let element = await driver.findElement(By.css("h2"));
    assert.strictEqual(await element.getText(), "LambdaTest Sample App");

    assert.strictEqual(await getTextRemaining(driver), "5 of 5 remaining");

    let checkbox = await findNthCheckbox(driver, 1);
    let span = await checkbox.findElement(By.xpath("following-sibling::*[1]"));
    assert.strictEqual(await checkbox.getAttribute("checked"), null);
    assert.strictEqual(await span.getAttribute("class"), "done-false");

    let todoItems = await driver.findElements(By.css("ul li"));
    for (let todoItem of todoItems) {
        let checkbox = await todoItem.findElement(By.css("input[type=checkbox]"));
        let spanClass = await todoItem.findElement(By.css("span")).getAttribute("class");
        assert.strictEqual(spanClass, "done-false");
        await checkbox.click();
        assert.strictEqual(await todoItem.findElement(By.css("span")).getAttribute("class"), "done-true");
    }

    let newItem = "Six Item";
    await driver.findElement(By.id("sampletodotext")).sendKeys(newItem);
    await driver.findElement(By.id("addbutton")).click();

    await driver.wait(until.elementTextMatches(driver.findElement(By.className("ng-binding")), /\d+ of \d+ remaining/), 5000);
  
    let addedCheckbox = await findNthCheckbox(driver, 6);
    span = await addedCheckbox.findElement(By.xpath("following-sibling::*[1]"));
    assert.strictEqual(await addedCheckbox.getAttribute("checked"), null);
    assert.strictEqual(await span.getAttribute("class"), "done-false");
    assert.strictEqual(await getTextRemaining(driver), "6 of 6 remaining");

    await addedCheckbox.click();
    assert.strictEqual(await addedCheckbox.getAttribute("checked"), "true");
    assert.strictEqual(await span.getAttribute("class"), "done-true");
    assert.strictEqual(await getTextRemaining(driver), "5 of 6 remaining");

    console.log('All steps executed successfully');
  } catch (err) {
    await driver.takeScreenshot().then(function (image) {
      require('fs').writeFileSync('screenshot_error.png', image, 'base64');
    });
    console.error('Error executing the test: %s', err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}
runTests();
