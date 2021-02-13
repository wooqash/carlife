import Utils from './utils';

require('waypoints/lib/noframework.waypoints.min');

export default class UIAnimations {
    constructor(
        private elem: HTMLElement,
        private animationType: string,
        private animationDelay?: string,
        private offset?: string,
    ) {}

    mount = (): void => {
        const { animationType, animationDelay, offset } = this;
        (() =>
            new Waypoint({
                element: this.elem || undefined,
                handler() {
                    if (this.element) {
                        Utils.addClasses(this.element, [
                            'animate__animated',
                            `animate__${animationType}`,
                            `animate__delay-${animationDelay}` || '',
                        ]);
                    }
                },
                offset,
            }))();
    };
}
