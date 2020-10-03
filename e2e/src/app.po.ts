import { browser, by, element } from 'protractor';

/**
 * Shared.
 */
export class AppPage {
    async navigateTo(): Promise<undefined> {
        return browser.get(browser.baseUrl) as Promise<undefined>;
    }

    async getTitleText(): Promise<string> {
        return element(by.css('app-root h1')).getText() as Promise<string>;
    }
}
