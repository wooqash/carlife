import './sass/styles.scss';
// import * as test from './scripts/test-module';
import handleView from './scripts/spy-menu';

import Utils from './scripts/classes/utils';
import Dialog from './scripts/classes/dialog';

let prevScrollPos = window.pageYOffset;
const body = document.body as HTMLBodyElement;
const mainMenu = document.getElementById('MainMenu') as HTMLDivElement;
const menuToggler = document.getElementById('MainMenuToggler') as HTMLButtonElement;
const menuLinks = document.querySelectorAll('.main-nav__link') as NodeListOf<HTMLAnchorElement>;

const collapseButtons = document.querySelectorAll('[data-toggle="collapse"]') as NodeListOf<HTMLAnchorElement>;
const dialogOpenButtons = document.querySelectorAll('[data-dialog="dialog"]') as NodeListOf<HTMLElement>;
const dialogContainers = document.querySelectorAll('.dialog__content') as NodeListOf<HTMLElement>;

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
        Utils.removeClass(header, 'hide');
        Utils.addClass(scrollTopButton, 'hide');
    } else {
        Utils.addClass(header, 'hide');
        Utils.removeClass(scrollTopButton, 'hide');
    }
    prevScrollPos = currentScrollPos;
};

const handleCollapse = (event: Event): void => {
    event.preventDefault();
    const link = event.target as HTMLAnchorElement;
    const collapseId = link ? link.hash.substr(1) : null;
    const collapseElem = collapseId ? document.getElementById(collapseId) : null;

    if (collapseElem && collapseElem.style) {
        collapseElem.style.maxHeight =
            !collapseElem.style.maxHeight || collapseElem.style.maxHeight === '0px'
                ? `${collapseElem.scrollHeight}px`
                : '0';

        collapseElem.style.maxWidth =
            !collapseElem.style.maxWidth || collapseElem.style.maxWidth === '0px' ? '100%' : '0';

        Utils.toggleClass(collapseElem, 'offer-card__details--show');
    }

    console.log(event, link);
};

Array.from(menuLinks).forEach((link: HTMLAnchorElement) => {
    handleView(link);
    link.addEventListener('click', handleMenuLinks);
});

Array.from(collapseButtons).forEach((link: HTMLAnchorElement) => {
    link.addEventListener('click', handleCollapse);
});

menuToggler.addEventListener('click', toggleMainMenu);

window.addEventListener('scroll', showHideElementsOnScroll);

// Dialog
body.addEventListener('click', Dialog.close);

Array.from(dialogOpenButtons).forEach((link: HTMLElement) => {
    link.addEventListener('click', Dialog.open);
});

Array.from(dialogContainers).forEach((container: HTMLElement) => {
    container.addEventListener('click', Dialog.handleCloseBtn);
});
