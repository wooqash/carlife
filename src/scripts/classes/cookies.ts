// import Utils from './utils';

import Cookie from '../types/cookie.inteface';

export default class Cookies {
    isSet = (cName: string): boolean => {
        const ca = document.cookie.split(';');
        const allCookies = ca.map((cookieElem: string) => cookieElem.substring(0, cookieElem.indexOf('=')).trim());
        return allCookies.includes(cName);
    };

    set = (cName: string, cValue?: string | boolean, cDays?: number): void => {
        if (!cName) {
            return;
        }

        let expires = '';
        if (cDays) {
            const date = new Date();
            date.setTime(date.getTime() + cDays * 24 * 60 * 60 * 1000);
            expires = `expires=${date.toUTCString()};`;
        }

        document.cookie = `${encodeURIComponent(cName)}=${encodeURIComponent(cValue || '')};${expires}path=/`;
    };

    get = (cName: string): Cookie | null => {
        const cookieList = document.cookie.split(';');
        const cookiesArr = cookieList.map((cookieElem: string) => {
            const [cookieName, cookieValue] = cookieElem.split('=');
            return { name: cookieName ? cookieName.trim() : '', value: cookieValue ? cookieValue.trim() : '' };
        });

        return cookiesArr.find((cookie: Cookie) => cookie.name === cName) || null;
    };

    erase = (cName: string): void => {
        if (!cName) {
            return;
        }
        document.cookie = `${encodeURIComponent(cName)}=; Max-Age=-1;`;
    };
}
