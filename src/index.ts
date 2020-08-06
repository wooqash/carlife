import './sass/styles.scss';
// import * as test from './scripts/test-module';
import handleView from './scripts/spy-menu';

let prevScrollPos = window.pageYOffset;

const removeActiveClassFromMenu = (items: HTMLCollection): void => {
    Array.from(items).forEach((item: Element) => item.classList.remove('active'));
};

const handleMenuLinks = (event: Event): void => {
    // event.preventDefault();
    const link = event.target as HTMLAnchorElement;
    const menuItems = link.parentElement?.parentElement?.children;
    if (menuItems) {
        removeActiveClassFromMenu(menuItems);
    }
    link.parentElement?.classList.add('active');
};

const toggleMainMenu = (event: Event): void => {
    event.preventDefault();
    const button = event.currentTarget as HTMLButtonElement;
    const mainMenu = document.getElementById('MainMenu') as HTMLDivElement;
    button.classList.toggle('is-active');
    mainMenu.classList.toggle('show');
};

const showHideElementsOnScroll = (): void => {
    const currentScrollPos = window.pageYOffset;
    const header = document.getElementById('Header') as HTMLHeadingElement;
    const scrollTopButton = document.getElementById('ScrollTop') as HTMLButtonElement;

    if (prevScrollPos > currentScrollPos) {
        header.classList.remove('hide');
        scrollTopButton.classList.add('hide');
    } else {
        header.classList.add('hide');
        scrollTopButton.classList.remove('hide');
    }
    prevScrollPos = currentScrollPos;
};

const menuToggler = document.getElementById('MainMenuToggler') as HTMLButtonElement;
const menuLinks = document.querySelectorAll('.main-nav__link') as NodeListOf<HTMLAnchorElement>;

Array.from(menuLinks).forEach((link: HTMLAnchorElement) => {
    handleView(link);
    link.addEventListener('click', handleMenuLinks);
});
menuToggler.addEventListener('click', toggleMainMenu);

window.addEventListener('scroll', showHideElementsOnScroll);
