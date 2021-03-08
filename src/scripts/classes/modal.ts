import Utils from './utils';

export default class Modal {
    private static modalSettings = {
        closeBtnClass: 'modal__close-btn',
        visibilityClass: 'modal--show',
        visibleModalContainerClass: 'modal__container',
    };

    private static body = document.querySelector('body') as HTMLBodyElement;

    static show(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        const target = e.currentTarget as HTMLButtonElement;
        const targetId = target.getAttribute('data-target') || '';
        const modal = document.getElementById(targetId) as HTMLDivElement;
        Utils.addClass(modal, this.modalSettings.visibilityClass);
        Utils.lockScroll(this.body);
        this.body.addEventListener('click', this.handleCloseModal, false);
    }

    static hide(e: Event): void {
        e.stopPropagation();
        const target = e.currentTarget as HTMLButtonElement;
        const targetId = target.getAttribute('data-close-modal') || '';
        const modal = targetId
            ? (document.getElementById(targetId) as HTMLDivElement)
            : (document.querySelector(`.${this.modalSettings.visibilityClass}`) as HTMLDivElement);
        this.body.removeEventListener('click', this.handleCloseModal, false);
        Utils.removeClass(modal, this.modalSettings.visibilityClass);
        Utils.unlockScroll(this.body);
    }

    static handleCloseModal(e: Event): void {
        const target = e.target as HTMLElement;
        if (
            !target.closest(
                `.${Modal.modalSettings.visibilityClass} .${Modal.modalSettings.visibleModalContainerClass}`,
            )
        ) {
            Modal.hide(e);
        }
    }
}
