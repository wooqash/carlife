import './sass/styles.scss';

import CookieBar from './scripts/classes/cookieBar';
import EmailProtector from './scripts/classes/emailProtector';
import Menu from './scripts/classes/menu';
import Utils from './scripts/classes/utils';

document.addEventListener('DOMContentLoaded', () => {
    const presentYearElem = document.querySelector('.copyrights__year') as HTMLSpanElement;
    presentYearElem.innerText = `${new Date().getFullYear()}`;

    let prevScrollPos = window.pageYOffset;
    const mainMenuElem = document.getElementById('MainMenu') as HTMLDivElement;
    const header = document.getElementById('Header') as HTMLHeadingElement;

    (() => new Menu(mainMenuElem))();
    window.addEventListener('scroll', () => {
        prevScrollPos = Utils.showHideElementOnScroll(header, prevScrollPos);
    });

    const emailAddressElem = document.querySelectorAll('.privacy-email') as NodeListOf<HTMLSpanElement>;
    Array.from(emailAddressElem).forEach((emailElem: HTMLSpanElement) => {
        const email = new EmailProtector(emailElem);
        email.render('odo', 'carlifecygulski.pl');
    });

    // Cookie bar
    const cookieBarElem = document.getElementById('CookiesPolicyBar') as HTMLDivElement;
    (() => new CookieBar(cookieBarElem))();
});
