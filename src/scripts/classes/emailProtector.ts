export default class EmailProtector {
    constructor(private container: HTMLParagraphElement) {}

    render(userId: string, domain: string): void {
        const emailLink = document.createElement('a');
        const emailLinkText = document.createTextNode(`${userId} at ${domain}`);
        emailLink.appendChild(emailLinkText);
        emailLink.setAttribute('href', `mailto:${userId}@${domain}`);
        this.container.append(emailLink);
    }
}
