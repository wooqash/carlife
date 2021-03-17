export default class EmailProtector {
    constructor(private container: HTMLElement) {}

    render(userId: string, domain: string): void {
        const emailLink = document.createElement('a');
        const emailLinkText = document.createTextNode(`${userId} at ${domain}`);
        emailLink.appendChild(emailLinkText);
        emailLink.setAttribute('href', `mailto:${userId}@${domain}`);
        emailLink.setAttribute('tabindex', '0');
        this.container.append(emailLink);
    }
}
