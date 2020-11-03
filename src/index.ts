import './sass/styles.scss';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

import handleView from './scripts/spy-menu';

import Utils from './scripts/classes/utils';
import Dialog from './scripts/classes/dialog';
import Form from './scripts/classes/form';
import Gallery from './scripts/classes/gallery';

document.addEventListener('DOMContentLoaded', () => {
    let prevScrollPos = window.pageYOffset;
    const body = document.body as HTMLBodyElement;
    const mainMenu = document.getElementById('MainMenu') as HTMLDivElement;
    const menuToggler = document.getElementById('MainMenuToggler') as HTMLButtonElement;
    const menuLinks = document.querySelectorAll('.main-nav__link') as NodeListOf<HTMLAnchorElement>;

    const collapseButtons = document.querySelectorAll('[data-toggle="collapse"]') as NodeListOf<HTMLAnchorElement>;
    const dialogOpenMoreOfferButtons = document.querySelectorAll('.button--more') as NodeListOf<HTMLElement>;
    const dialogOpenGalleryButtons = document.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
    const dialogContainers = document.querySelectorAll('.dialog__content') as NodeListOf<HTMLElement>;

    const showMoreGalleryBtn = document.getElementById('GalleryShowMore') as HTMLButtonElement;
    const mainGalleryElem = document.getElementById('MainGallery') as HTMLElement;
    const mainGallery = new Gallery(mainGalleryElem, showMoreGalleryBtn);

    const reservationFormElem = document.getElementById('ReservationForm') as HTMLFormElement;
    const reservationForm = new Form(reservationFormElem);

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

        // console.log(event, link);
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
    const offerDialog = new Dialog();
    const galleryDialog = new Dialog();
    body.addEventListener('click', Dialog.close);

    Array.from(dialogOpenMoreOfferButtons).forEach((link: HTMLElement) => {
        link.addEventListener('click', offerDialog.open);
    });

    Array.from(dialogOpenGalleryButtons).forEach((picture: HTMLElement, index: number) => {
        picture.addEventListener('click', (e) => {
            galleryDialog.open(e);
            // console.log(index);
            const slider = mainGallery.getSlider();
            slider.slideTo(index + 1);
        });
    });

    Array.from(dialogContainers).forEach((container: HTMLElement) => {
        container.addEventListener('click', offerDialog.handleCloseBtn, false);
    });

    // Gallery

    mainGallery.init();

    showMoreGalleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mainGallery.showMore();
    });

    // form
    if (reservationForm) {
        const serviceTypeCtrl = document.getElementById('Services');
        const hiddenFields: HTMLElement[] = Array.from(document.querySelectorAll('.form__control--hidden'));

        if (serviceTypeCtrl) {
            serviceTypeCtrl.addEventListener('change', (e: Event) => {
                const target = e.target as HTMLSelectElement;
                if (target.value === 'Holowanie') {
                    hiddenFields.forEach((field) => Utils.removeClass(field, 'form__control--hidden'));
                } else {
                    hiddenFields.forEach((field) => Utils.addClass(field, 'form__control--hidden'));
                }

                if (target.value) {
                    Utils.removeClass(serviceTypeCtrl, 'not-touched');
                } else {
                    Utils.addClass(serviceTypeCtrl, 'not-touched');
                }
            });
        }
    }
});
