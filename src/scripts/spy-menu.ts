import inView = require('in-view');

const handleView = (item: HTMLAnchorElement): void => {
    if (!item) {
        return;
    }
    const menuItem = item.parentElement as HTMLLIElement;
    const offsetHeight = 0.99 * window.innerHeight;

    inView.offset({
        bottom: offsetHeight,
    });

    if (item.hash) {
        inView(item.hash)
            .on('enter', () => menuItem.classList.add('active'))
            .on('exit', () => menuItem.classList.remove('active'));
    }
};

export default handleView;
