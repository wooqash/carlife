import './sass/styles.scss';
// import * as test from './scripts/test-module';
import handleView from './scripts/spy-menu';

import * as utils from './scripts/classes/utils';

let prevScrollPos = window.pageYOffset;
const mainMenu = document.getElementById('MainMenu') as HTMLDivElement;
const menuToggler = document.getElementById('MainMenuToggler') as HTMLButtonElement;
const menuLinks = document.querySelectorAll('.main-nav__link') as NodeListOf<HTMLAnchorElement>;

const removeActiveClassFromMenu = (items: HTMLCollection): void => {
    Array.from(items).forEach((item: Element) => item.classList.remove('active'));
};

const toggleMainMenu = (): void => {
    Utils.toggleClass(menuToggler, 'is-active');
    Utils.toggleClass(mainMenu, 'show');
};

const handleMenuLinks = (event: Event): void => {
    const link = event.target as HTMLAnchorElement;
    const menuItem = link ? link.parentElement : null;
    const menuItems = link.parentElement?.parentElement?.children;

    if (menuItems) {
        removeActiveClassFromMenu(menuItems);
    }
    if (menuItem) {
        Utils.addClass(menuItem, 'active');
    }

    toggleMainMenu();
};

const showHideElementsOnScroll = (): void => {
    const currentScrollPos = window.pageYOffset;
    const header = document.getElementById('Header') as HTMLHeadingElement;
    const scrollTopButton = document.getElementById('ScrollTop') as HTMLButtonElement;

    if (prevScrollPos > currentScrollPos) {
        utils.default.removeClass(header, 'hide');
        utils.default.addClass(scrollTopButton, 'hide');
    } else {
        utils.default.addClass(header, 'hide');
        utils.default.removeClass(scrollTopButton, 'hide');
    }
    prevScrollPos = currentScrollPos;
};

Array.from(menuLinks).forEach((link: HTMLAnchorElement) => {
    handleView(link);
    link.addEventListener('click', handleMenuLinks);
});

menuToggler.addEventListener('click', toggleMainMenu);

window.addEventListener('scroll', showHideElementsOnScroll);
