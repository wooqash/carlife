import Utils from './utils';

export default class Dialog {
    static closeBtnClass = 'dialog__close-btn';

    static visibilityClass = 'dialog--show';

    open = (event: Event): void => {
        event.preventDefault();
        event.stopPropagation();
        // console.log(event, event.target, event.currentTarget);
        const link = event.currentTarget as HTMLElement;
        const dialogId = link && link.hasAttribute('aria-controls') ? link.getAttribute('aria-controls') : null;
        const dialogElem = dialogId ? document.getElementById(dialogId) : null;

        if (dialogElem) {
            Utils.addClass(dialogElem, Dialog.visibilityClass);
        }
    };

    static close = (): void => {
        const activeDialogBox = document.querySelector(`.${Dialog.visibilityClass}`) as HTMLElement;
        // console.log(activeDialogBox);
        if (activeDialogBox && Utils.hasClass(activeDialogBox, Dialog.visibilityClass)) {
            Utils.removeClass(activeDialogBox, Dialog.visibilityClass);
        }
    };

    handleCloseBtn = (e: Event): void => {
        const target = e.target as HTMLElement;
        const isCloseBtn =
            Utils.hasClass(target as HTMLButtonElement, Dialog.closeBtnClass) ||
            Utils.hasClass(target.offsetParent as HTMLButtonElement, Dialog.closeBtnClass);

        if (!isCloseBtn) {
            e.stopPropagation();
        }
    };
}
