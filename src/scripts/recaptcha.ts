import PageKeys from './types/keys.enum';

const scriptTag = document.querySelector('#ReCaptcha') as HTMLScriptElement;

const loadScript = () => {
    let source = scriptTag.getAttribute('data-src');
    if (!source) {
        source = `https://www.google.com/recaptcha/api.js?render=${PageKeys.RECAPTCHAPUBLICKEY}`;
    }
    scriptTag.src = source;
};

const isRecaptchaLoaded = (): boolean => {
    if (scriptTag && scriptTag.hasAttribute('src')) {
        return true;
    }
    return false;
};

const initGoogleRecaptcha = (elements: NodeListOf<HTMLElement>): void => {
    if (isRecaptchaLoaded()) {
        return;
    }

    elements.forEach((elem: HTMLElement) => {
        elem.addEventListener('click', (e) => {
            if (!isRecaptchaLoaded()) {
                loadScript();
            }
        });
    });
};

export default initGoogleRecaptcha;
