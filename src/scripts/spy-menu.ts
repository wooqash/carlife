import inView = require('in-view');

const handleView = (item: HTMLAnchorElement): void => {
    if (!item) {
        return;
    }

    const offsetHeight = 0.99 * window.innerHeight;

    inView.offset({
        bottom: offsetHeight,
    });

    inView(item.hash)
        .on('enter', () => item.parentElement?.classList.add('active'))
        .on('exit', () => item.parentElement?.classList.remove('active'));
};

export default handleView;
