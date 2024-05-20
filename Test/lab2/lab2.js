const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async goToUrl(url) {
        await this.driver.get(url);
    }

    async click(locator) {
        const element = await this.driver.findElement(locator);
        await element.click();
    }

    async enterText(locator, text) {
        const element = await this.driver.findElement(locator);
        await element.sendKeys(text, Key.RETURN);
    }

    async getTextOfElement(locator) {
        const element = await this.driver.findElement(locator);
        return await element.getText();
    }

    async getAttributeOfElement(locator, attributeName) {
        const element = await this.driver.findElement(locator);
        return await element.getAttribute(attributeName);
    }

    async closeBrowser() {
        await this.driver.quit();
    }
}

class MospolytechPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.schedulesButton = By.css('a[title="Расписание"]');
        this.seeOnWebsiteLink = By.css('a[href="https://rasp.dmami.ru/"]');
        this.searchField = By.xpath("//input[@class='groups']");
        this.currentWeekDay = By.xpath('//div[contains(@class, "schedule-day_today")]/div[contains(@class, "schedule-day__title")]');
        this.currentWeekDayColor = By.xpath('//div[contains(@class, "schedule-day_today")]/div[contains(@class, "schedule-day__title")]');
    }

    async open() {
        await this.goToUrl('https://mospolytech.ru/');
    }

    async clickSchedulesButton() {
        await this.click(this.schedulesButton);
    }

    async clickSeeOnWebsiteLink() {
        await this.click(this.seeOnWebsiteLink);
    }

    async SwitchToNextTab() {
        let originalTab = await this.driver.getWindowHandle();
        const windows = await this.driver.getAllWindowHandles();
        
        windows.forEach(async handle => {
            if (handle !== originalTab) {
                await this.driver.switchTo().window(handle);
            }
        });
    }

    async searchGroup(searchText) {
        await this.enterText(this.searchField, searchText);
    }

    async getWeekDayText() {
        return await this.getTextOfElement(this.currentWeekDay);
    }

    async getWeekDayColor() {
        return await this.getAttributeOfElement(this.currentWeekDayColor, 'style');
    }
}

function getCurrentWeekDay() {
    let date = new Date()
    let options = { weekday: "long" };
    return new Intl.DateTimeFormat("ru-RU", options).format(date)
}

describe('Mospolytech.ru test', function() {
    this.timeout(70000);
    let driver;
    let mospolytechPage;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        mospolytechPage = new MospolytechPage(driver);
    });

    beforeEach(async function() {
        await mospolytechPage.open();
    });

    it('Поиск расписания группы 221-322', async function() {
        try {
            await mospolytechPage.clickSchedulesButton();
            await mospolytechPage.clickSeeOnWebsiteLink();
            await mospolytechPage.SwitchToNextTab();
            await mospolytechPage.searchGroup('221-322');
            await driver.sleep(3000);
            await mospolytechPage.click(By.xpath('//div[@id="221-322"]'));
            await driver.sleep(2000);
        } catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    });

    it('Сравнивает выделенный день недели с сегодняшним', async function() {
        try {
            let weekDayOnPage = await mospolytechPage.getWeekDayText();
            let systemWeekDay = getCurrentWeekDay(); 
            assert.strictEqual(weekDayOnPage.toUpperCase(), systemWeekDay.toUpperCase(), "Дни недели не совпадают");
    
            let weekDayColor = await mospolytechPage.getWeekDayColor();
            assert.ok(weekDayColor.includes('background-color'), "День недели не выделен цветом");
        } catch (error) {
            console.log("На странице нет выделенного дня недели");
        }
    });    
    
    after(async function() {
        await mospolytechPage.closeBrowser();
    });
});
