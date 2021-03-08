import Utils from './utils';
import handleView from '../spy-menu';
import { MenuSettings } from '../types/menuSettings.interface';

export default class Menu {
    private menuSettings: MenuSettings = {
        menuItemClass: 'main-nav__item',
        menuLinkClass: 'main-nav__link',
        activeMenuItemClass: 'active',
        menuToggleId: 'MainMenuToggle',
    };

    private menuLinks: NodeListOf<HTMLAnchorElement>;

    private menuToggleButton: HTMLButtonElement;

    constructor(private container: HTMLElement, settings?: MenuSettings) {
        this.menuSettings = Object.assign(this.menuSettings, settings);
        this.menuLinks = document.querySelectorAll(
            `#${this.container.id} .${this.menuSettings.menuLinkClass}`,
        ) as NodeListOf<HTMLAnchorElement>;
        this.menuToggleButton = document.getElementById(this.menuSettings.menuToggleId) as HTMLButtonElement;

        this.bindMenuLinks();
        this.bindToggleButton();
    }

    private bindMenuLinks = (): void => {
        Array.from(this.menuLinks).forEach((link: HTMLAnchorElement) => {
            handleView(link);
            link.addEventListener('click', this.handleMenuLinks);
        });
    };

    private bindToggleButton = (): void => {
        this.menuToggleButton.addEventListener('click', this.toggleMenu);
    };

    private handleMenuLinks = (e: Event): void => {
        const link = e.target as HTMLAnchorElement;
        const menuItem = link.parentElement as HTMLLIElement;
        const menuActiveItem = document.querySelector(
            `#${this.container.id} .${this.menuSettings.activeMenuItemClass}`,
        ) as HTMLLIElement;

        Utils.removeClass(menuActiveItem, this.menuSettings.activeMenuItemClass);
        Utils.addClass(menuItem, this.menuSettings.activeMenuItemClass);
    };

    private toggleMenu = (e: Event): void => {
        e.preventDefault();
        Utils.toggleClass(this.menuToggleButton, 'is-active');
        Utils.toggleClass(this.container, 'show');
    };
}
