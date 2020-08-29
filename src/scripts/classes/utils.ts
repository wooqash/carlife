export default class Utils {
    static addClass(el: HTMLElement, className: string): void {
        if (!el || !className) {
            return;
        }

        const element: HTMLElement = el;

        if (element.classList) {
            element.classList.add(className);
        } else {
            const classes = element.className.split(' ');
            const existingIndex = classes.indexOf(className);

            if (existingIndex === -1) {
                classes.push(className);
            }

            element.className = classes.join(' ');
        }
    }

    static removeClass(el: HTMLElement, className: string): void {
        if (!el || !className) {
            return;
        }

        const element: HTMLElement = el;

        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(
                new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
                ' ',
            );
        }
    }

    static toggleClass(el: HTMLElement, className: string): void {
        if (!el || !className) {
            return;
        }

        if (el.classList.contains(className)) {
            this.removeClass(el, className);
        } else {
            this.addClass(el, className);
        }
    }

    static hasClass(el: HTMLElement, className: string): boolean {
        if (!el || !className) {
            return false;
        }

        const element: HTMLElement = el;

        if (element.classList) {
            return element.classList.contains(className);
        }

        const classes = element.className.split(' ');
        const existingIndex = classes.indexOf(className);

        return existingIndex > -1;
    }
}
