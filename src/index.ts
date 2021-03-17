/* eslint-disable func-names */
import './sass/styles.scss';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'animate.css/animate.min.css';

import { Swiper, Navigation, Pagination, Autoplay } from 'swiper';
import Modernizr from 'modernizr';

import Utils from './scripts/classes/utils';
import Form from './scripts/classes/form';
import UIAnimations from './scripts/classes/ui-animation';
import EmailProtector from './scripts/classes/emailProtector';
import Modal from './scripts/classes/modal';
import Menu from './scripts/classes/menu';
import CookieBar from './scripts/classes/cookieBar';

Swiper.use([Navigation, Pagination, Autoplay]);

document.addEventListener('DOMContentLoaded', () => {
    Modernizr.on('webp', (result) => {});

    const presentYearElem = document.querySelector('.copyrights__year') as HTMLSpanElement;
    presentYearElem.innerText = `${new Date().getFullYear()}`;

    let prevScrollPos = window.pageYOffset;
    const mainMenuElem = document.getElementById('MainMenu') as HTMLDivElement;
    const header = document.getElementById('Header') as HTMLHeadingElement;

    (() => new Menu(mainMenuElem))();
    window.addEventListener('scroll', () => {
        prevScrollPos = Utils.showHideElementOnScroll(header, prevScrollPos);
    });

    // --- SECTION HOME ---
    const mainTitleElem = document.getElementById('MainTitle') as HTMLHeadingElement;
    const mainSubTitleElem = document.getElementById('MainSubTitle') as HTMLParagraphElement;
    const mainCtaBtnOfferElem = document.getElementById('MainBtnOffer') as HTMLAnchorElement;
    const mainCtaBtnReservationElem = document.getElementById('MainBtnReservation') as HTMLAnchorElement;
    const towCarElem = document.querySelector('.tow-car') as HTMLPictureElement;

    // Section elements animations
    const mainTitleElemAnimation = new UIAnimations(mainTitleElem, 'fadeInDown', '', '100%');
    const mainSubTitleElemAnimation = new UIAnimations(mainSubTitleElem, 'fadeInUp', '1s', '100%');
    const mainCtaBtnOfferAnimation = new UIAnimations(mainCtaBtnOfferElem, 'lightSpeedInLeft', '2s', '100%');
    const mainCtaBtnReservationAnimation = new UIAnimations(
        mainCtaBtnReservationElem,
        'lightSpeedInRight',
        '2s',
        '100%',
    );
    const towCarElemAnimation = new UIAnimations(towCarElem, 'slideInLeft', '3s', '100%');

    mainTitleElemAnimation.mount();
    mainSubTitleElemAnimation.mount();
    mainCtaBtnOfferAnimation.mount();
    mainCtaBtnReservationAnimation.mount();
    towCarElemAnimation.mount();

    // --- SECTION ABOUT ---
    const aboutTextElem = document.querySelector('#About .section__text') as HTMLElement;
    const aboutListElem = document.querySelector('#About .section__list') as HTMLElement;
    const aboutImgElem = document.querySelector('#About .section__picture') as HTMLElement;

    // Section elements animations
    const aboutTextElemAnimation = new UIAnimations(aboutTextElem, 'fadeInLeft', '', '100%');
    const aboutListElemAnimation = new UIAnimations(aboutListElem, 'fadeInLeft', '1s', '100%');
    const aboutImgElemAnimation = new UIAnimations(aboutImgElem, 'fadeInRight', '2s', '100%');
    aboutTextElemAnimation.mount();
    aboutListElemAnimation.mount();
    aboutImgElemAnimation.mount();

    // --- SECTION OFFER ---
    const moreOfferButtons = document.querySelectorAll('.button--more') as NodeListOf<HTMLButtonElement>;
    const modalCloseTriggers = document.querySelectorAll('[data-close-modal]') as NodeListOf<HTMLButtonElement>;
    const offerCardsElem = document.querySelectorAll('#Offer .offer-card') as NodeListOf<HTMLDivElement>;

    // Section elements animations
    [...offerCardsElem].forEach((offerCardElem: HTMLDivElement, index: number) => {
        const offerCardElemAnimation = new UIAnimations(offerCardElem, 'zoomIn', `${index}s`, '100%');
        offerCardElemAnimation.mount();
    });

    // Offer modals
    Array.from(moreOfferButtons).forEach((moreOfferBtn: HTMLButtonElement) => {
        moreOfferBtn.addEventListener(
            'click',
            (e: Event) => {
                Modal.show(e);
            },
            false,
        );
    });

    Array.from(modalCloseTriggers).forEach((modalCloseTrigger: HTMLButtonElement) => {
        modalCloseTrigger.addEventListener(
            'click',
            (e: Event) => {
                Modal.hide(e);
            },
            false,
        );
    });

    // --- SECTION GALLERY ---
    const thumbnailsElem = document.querySelector('.thumbnails') as HTMLDivElement;
    const thumbnailLinks = document.querySelectorAll('.thumbnail') as NodeListOf<HTMLAnchorElement>;
    const galleryElem = document.querySelector('.gallery') as HTMLDivElement;

    // Section elements animations
    [...thumbnailLinks].forEach((galleryImageElem: HTMLElement) => {
        const galleryImageElemAnimation = new UIAnimations(galleryImageElem, 'flipInX', '1s', '100%');
        galleryImageElemAnimation.mount();
    });

    // Gallery thumbnail slider
    (() =>
        new Swiper(thumbnailsElem, {
            a11y: {
                prevSlideMessage: 'poprzedni slajd',
                nextSlideMessage: 'następny slajd',
                firstSlideMessage: 'pierwszy slajd',
                lastSlideMessage: 'ostatni slajd',
                paginationBulletMessage: 'pokaż rekomendację nr {{index}}',
            },
            cssMode: true,
            freeMode: true,
            grabCursor: true,
            initialSlide: 0,
            keyboard: {
                enabled: true,
                onlyInViewport: false,
                pageUpDown: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            noSwiping: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            slidesPerView: 'auto',
            spaceBetween: 20,
        }))();

    // Gallery slider
    const gallerySlider = new Swiper(galleryElem, {
        a11y: {
            prevSlideMessage: 'poprzedni slajd',
            nextSlideMessage: 'następny slajd',
            firstSlideMessage: 'pierwszy slajd',
            lastSlideMessage: 'ostatni slajd',
            paginationBulletMessage: 'pokaż rekomendację nr {{index}}',
        },
        centeredSlides: true,
        cssMode: true,
        grabCursor: true,
        keyboard: {
            enabled: true,
            onlyInViewport: false,
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        noSwiping: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        slidesPerView: 1,
    });

    Array.from(thumbnailLinks).forEach((thumbnail: HTMLAnchorElement, index: number) => {
        thumbnail.addEventListener('click', (e: Event) => {
            console.log(thumbnail, index);
            Modal.show(e);
            gallerySlider?.slideTo(index);
        });
    });

    // --- SECTION RESERVATION ---
    const reservationFormElem = document.getElementById('ReservationForm') as HTMLFormElement;
    const reservationTextElem = document.querySelector('#Reservation .section__text') as HTMLDivElement;
    const reservationForm = new Form(reservationFormElem);

    // Section elements animations
    const reservationTextElemAnimation = new UIAnimations(reservationTextElem, 'slideInLeft', '', '100%');
    const reservationFormElemAnimation = new UIAnimations(reservationFormElem, 'fadeInRight', '1s', '100%');
    reservationTextElemAnimation.mount();
    reservationFormElemAnimation.mount();

    // Reservation form
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

    // --- SECTION RECOMMENDATION ---
    // Recommendation Slider
    const recommendationElem = document.getElementById('RecommendationContainer') as HTMLDivElement;
    (() =>
        new Swiper(recommendationElem, {
            a11y: {
                paginationBulletMessage: 'pokaż rekomendację nr {{index}}',
            },
            autoHeight: false,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            cssMode: true,
            keyboard: {
                enabled: true,
                onlyInViewport: false,
                pageUpDown: true,
            },
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        }))();

    // --- SECTION FAQ ---
    // Section elements animations
    const faqItemsElem = document.querySelectorAll('#FAQ .accordion-wrapper') as NodeListOf<HTMLDivElement>;
    [...faqItemsElem].forEach((faqItemElem: HTMLDivElement, index: number) => {
        const faqItemElemAnimation = new UIAnimations(faqItemElem as HTMLDivElement, 'zoomIn', `${index}s`, '100%');
        faqItemElemAnimation.mount();
    });

    // --- SECTION CONTACT ---
    // Email protector
    const emailAddressElem = document.getElementById('EmailAddress') as HTMLParagraphElement;
    const email = new EmailProtector(emailAddressElem);
    email.render('biuro', 'carlifecygulski.pl');

    // Section elements animations
    const contactMapElem = document.querySelector('#Contact .contact-map') as HTMLDivElement;
    const contactInfoElem = document.querySelector('#Contact .contact-info') as HTMLElement;
    const contactMapElemAnimation = new UIAnimations(contactMapElem, 'zoomIn', '', '100%');
    const contactInfoElemAnimation = new UIAnimations(contactInfoElem, 'fadeInRight', '1s', '100%');
    contactMapElemAnimation.mount();
    contactInfoElemAnimation.mount();

    // Cookie bar
    const cookieBarElem = document.getElementById('CookiesPolicyBar') as HTMLDivElement;
    (() => new CookieBar(cookieBarElem))();
});
