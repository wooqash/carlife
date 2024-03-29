import { Swiper, Navigation, Pagination, Lazy, SwiperOptions } from 'swiper';
import Utils from './utils';

Swiper.use([Navigation, Pagination, Lazy]);
export default class Gallery {
    private minImgVisible: { [key: string]: number } = {
        mobile: 2,
        tablet: 2,
        desktop: 3,
    };

    // private imagesCount = 0;

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
    };

    constructor(private gallery: HTMLElement, private showMoreButton?: HTMLButtonElement) {}

    init = (): void => {
        // this.imagesCount = this.gallery.children.length;
        this.showLess();
    };

    showMore = (): void => {
        const hiddenImages = document.querySelectorAll('.gallery-item:not(.gallery-item--show)');
        const imageToShowInNextStep = hiddenImages.length - this.getMinImageVisible();
        Array.from(hiddenImages).forEach((image, index) => {
            if (index < this.getMinImageVisible()) {
                Utils.addClass(image as HTMLElement, this.clasess.galleryItemShow);
            }
        });

        if (imageToShowInNextStep < 1) {
            this.toogleMoreLessLabel();
        }

        if (hiddenImages.length === 0) {
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
