import { Swiper, Navigation, Pagination, Lazy, SwiperOptions } from 'swiper';
import Utils from './utils';

Swiper.use([Navigation, Pagination, Lazy]);
export default class Gallery {
    private minImgVisible: { [key: string]: number } = {
        mobile: 2,
        tablet: 4,
        desktop: 8,
    };

    private imageToShowInNextStep = 0;

    private hiddenImages: NodeListOf<Element>;

    private isMobile = Utils.isMobile();

    private screenWidth = window.screen.width;

    private moreLabel: HTMLElement | null =
        this.showMoreButton && this.showMoreButton?.children.length > 0
            ? (this.showMoreButton?.children[0] as HTMLElement)
            : null;

    private lessLabel: HTMLElement | null =
        this.showMoreButton && this.showMoreButton?.children.length > 0
            ? (this.showMoreButton?.children[1] as HTMLElement)
            : null;

    private swiperParams: SwiperOptions = {
        a11y: {
            prevSlideMessage: 'poprzedni slajd',
            nextSlideMessage: 'następny slajd',
            firstSlideMessage: 'pierwszy slajd',
            lastSlideMessage: 'ostatni slajd',
            paginationBulletMessage: 'idź do slajdu nr {{index}}',
        },
        autoHeight: false,
        cssMode: true,
        keyboard: {
            enabled: true,
            onlyInViewport: false,
            pageUpDown: true,
        },
        loop: true,
        lazy: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
    };

    private slider = new Swiper('.gallery-slider', this.swiperParams);

    private clasess = {
        galleryItemShow: 'gallery-item--show',
        buttonLabelShow: 'button__label--show',
        buttonHidden: 'button--hidden',
    };

    constructor(private gallery: HTMLElement, private showMoreButton?: HTMLButtonElement) {
        this.showLess();
        this.hiddenImages = document.querySelectorAll('.gallery-item:not(.gallery-item--show)');
        this.imageToShowInNextStep = this.hiddenImages.length - this.getMinImageVisible();

        if (this.hiddenImages.length === 0) {
            this.hideShowMoreButton();
        }
    }

    showMore = (): void => {
        Array.from(this.hiddenImages).forEach((image, index) => {
            if (index < this.getMinImageVisible()) {
                Utils.addClass(image as HTMLElement, this.clasess.galleryItemShow);
            }
        });

        if (this.imageToShowInNextStep < 1) {
            this.toogleMoreLessLabel();
            this.hideShowMoreButton();
        }

        if (this.hiddenImages.length === 0) {
            this.showLess();
        }
    };

    showLess = (): void => {
        Array.from(this.gallery.children).forEach((image, index) => {
            if (index >= this.getMinImageVisible()) {
                Utils.removeClass(image as HTMLElement, this.clasess.galleryItemShow);
            }
        });
    };

    getSlider = (): Swiper => this.slider;

    private hideShowMoreButton = (): void => {
        Utils.addClass(this.showMoreButton as HTMLElement, this.clasess.buttonHidden);
    };

    private getMinImageVisible = (): number => {
        let device = 'desktop';
        if (this.isMobile && this.screenWidth < 768) {
            device = 'mobile';
        } else if (this.isMobile && this.screenWidth >= 768 && this.screenWidth < 1024) {
            device = 'tablet';
        }
        const getKeyValue = <T extends Record<string, unknown>, U extends keyof T>(obj: T) => (key: U) => obj[key];
        return getKeyValue(this.minImgVisible)(device);
    };

    private toogleMoreLessLabel = (): void => {
        if (this.moreLabel && this.lessLabel) {
            Utils.toggleClass(this.moreLabel, this.clasess.buttonLabelShow);
            Utils.toggleClass(this.lessLabel, this.clasess.buttonLabelShow);
        }
    };
}
