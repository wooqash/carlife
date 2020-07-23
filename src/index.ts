import './sass/styles.scss';
// import * as test from './scripts/test-module';

const removeActiveClassFromMenu = (items: HTMLCollection): void => {
    Array.from(items).forEach((item: Element) => item.classList.remove('active'));
};

const handleMenuLinks = (event: Event): void => {
    event.preventDefault();
    const link = event.target as HTMLAnchorElement;
    const menuItems = link.parentElement?.parentElement?.children;
    if (menuItems) {
        removeActiveClassFromMenu(menuItems);
    }
    link.parentElement?.classList.add('active');
};

const menuLinks = document.querySelectorAll('.main-nav__link') as NodeListOf<HTMLAnchorElement>;
Array.from(menuLinks).forEach((link: HTMLAnchorElement) => link.addEventListener('click', handleMenuLinks));
