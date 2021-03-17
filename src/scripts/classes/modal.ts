import { TabOrder } from '../types/tabOrder.enum';
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
        const focusableElem = document.querySelectorAll('[tabindex="0"]') as NodeListOf<HTMLElement>;

        Utils.addClass(modal, this.modalSettings.visibilityClass);
        Utils.lockScroll(this.body);
        this.setElemsTabOrder(Array.from(focusableElem), TabOrder.REMOVE);
        this.setElemsTabOrder([modal], TabOrder.ADD);
        this.body.addEventListener('click', this.handleCloseModal, false);
    }

    static hide(e: Event): void {
        e.stopPropagation();
        const target = e.currentTarget as HTMLButtonElement;
        const targetId = target.getAttribute('data-close-modal') || '';
        const modal = targetId
            ? (document.getElementById(targetId) as HTMLDivElement)
            : (document.querySelector(`.${this.modalSettings.visibilityClass}`) as HTMLDivElement);
        const focusableElem = document.querySelectorAll('[tabindex="-1"]') as NodeListOf<HTMLElement>;

        this.body.removeEventListener('click', this.handleCloseModal, false);
        Utils.removeClass(modal, this.modalSettings.visibilityClass);
        Utils.unlockScroll(this.body);
        this.setElemsTabOrder(Array.from(focusableElem), TabOrder.ADD);
        this.setElemsTabOrder([modal], TabOrder.REMOVE);
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

    private static setElemsTabOrder(elements: HTMLElement[], tabOrder: TabOrder): void {
        elements.forEach((elem: HTMLElement) => {
            elem.setAttribute('tabindex', tabOrder);
        });
    }
}
