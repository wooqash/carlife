import Cookies from './cookies';
import Modal from './modal';
import Utils from './utils';

export default class CookieBar {
    private consent: boolean;

    private cookie: Cookies;

    private cookieBarSettings = {
        cookieConsentName: 'ga_cookie_consent',
        cookieBarId: 'CookiesPolicyBar',
        cookieBarSettingsBtnId: 'CookiesSettingsButton',
        cookieBarAcceptBtnId: 'AcceptCookiesButton',
        cookieSaveSettingsButtonId: 'SaveSettingsButton',
        cookieSettingsLink: 'CookiesSettingsLink',
        cookieGAId: 'GACookie',
        cookieBarHideClass: 'hide',
    };

    constructor(private container: HTMLDivElement) {
        this.cookie = new Cookies();
        this.consent = this.cookie.isSet(this.cookieBarSettings.cookieConsentName);
        this.showOrHideCookieBar();
        this.setGAConsentStatus();
        this.bindCookieSettingButton();
        this.bindAcceptCookiesButton();
        this.bindSettingsModalLink();
        this.bindSaveCookieButton();
    }

    private showOrHideCookieBar(): void {
        if (this.consent) {
            this.hideCookieBar();
        } else {
            this.showCookieBar();
        }
    }

    private showCookieBar(): void {
        Utils.removeClass(this.container, this.cookieBarSettings.cookieBarHideClass);
    }

    private hideCookieBar(): void {
        Utils.addClass(this.container, this.cookieBarSettings.cookieBarHideClass);
    }

    private bindCookieSettingButton(): void {
        const button = document.getElementById(this.cookieBarSettings.cookieBarSettingsBtnId) as HTMLButtonElement;
        button.addEventListener('click', (e) => Modal.show(e));
    }

    private bindAcceptCookiesButton(): void {
        const button = document.getElementById(this.cookieBarSettings.cookieBarAcceptBtnId) as HTMLButtonElement;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.cookie.set(this.cookieBarSettings.cookieConsentName, true, 90);
            this.hideCookieBar();
        });
    }

    private bindSettingsModalLink(): void {
        const link = document.getElementById(this.cookieBarSettings.cookieSettingsLink) as HTMLAnchorElement;
        link.addEventListener('click', (e) => Modal.show(e));
    }

    private bindSaveCookieButton(): void {
        const button = document.getElementById(this.cookieBarSettings.cookieSaveSettingsButtonId) as HTMLButtonElement;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const gaConsent = document.getElementById(this.cookieBarSettings.cookieGAId) as HTMLInputElement;
            if (gaConsent.checked) {
                this.cookie.set(this.cookieBarSettings.cookieConsentName, 'true', 90);
            } else {
                this.cookie.set(this.cookieBarSettings.cookieConsentName, 'false', 90);
                this.cookie.erase('_gid');
                this.cookie.erase('_ga');
                this.cookie.erase('_ga_3RT5DJ3VLH');
            }
            this.hideCookieBar();
        });
    }

    private setGAConsentStatus(): void {
        const gaConsent = document.getElementById(this.cookieBarSettings.cookieGAId) as HTMLInputElement;
        const cookie = this.cookie.get(this.cookieBarSettings.cookieConsentName);
        if (cookie?.value === '' || cookie?.value === 'false') {
            gaConsent.removeAttribute('checked');
        } else {
            gaConsent.setAttribute('checked', 'checked');
        }
    }
}
