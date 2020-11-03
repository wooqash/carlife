import Utils from './utils';
import { FormOptions } from '../types/form-options.interface';
import { SerializedObject } from '../types/serialized-obj.interface';
// import { PageKeys } from '../types/keys.enum';

export default class Form {
    private formOptions: FormOptions;

    constructor(private form: HTMLFormElement, options?: FormOptions) {
        const defaultOptions: FormOptions = {
            controlClass: 'form__control',
            controlErrorClass: 'form__control--error',
            errorMsgClass: 'form__error-text',
            formStatusClass: 'form__status',
            formClass: 'form',
            loadingClass: 'loading',
            successMsgClass: 'form-success-msg',
        };

        this.formOptions = Object.assign(defaultOptions, options);

        this.form.setAttribute('novalidate', 'novalidate');

        this.prepareElements();
        this.fieldsToHide();
        this.setMinDate();
        this.bindSubmit();
        this.bindRefreshFormButton();
        this.serializeObject();
    }

    private getFields = (): Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> => {
        const inputs: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = Array.from(
            this.form.querySelectorAll('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)'),
        );

        const result: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = [];

        inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
            // console.log(input.willValidate);
            if (input.willValidate) {
                result.push(input);
            }
        });

        return result;
    };

    private prepareElements = (): void => {
        const elements = this.getFields();

        elements.forEach((element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
            const tag = element.tagName.toLowerCase();
            const type = element.type.toLowerCase();

            let eventName = 'input';

            if (type === 'checkbox' || type === 'radio' || tag === 'select') {
                eventName = 'change';
            }

            element.addEventListener(eventName, (e) => {
                const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
                if (target) {
                    this.testInput(target);
                }
            });
        });
    };

    private testInput = (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean => {
        const valid = input.checkValidity();
        this.markFieldAsError(input, !valid);
        return valid;
    };

    private markFieldAsError = (field: HTMLElement, show: boolean): void => {
        const formControl: HTMLElement = field.closest(`.${this.formOptions.controlClass}`) as HTMLElement;
        const errorControl: HTMLElement = formControl.querySelector(
            `.${this.formOptions.errorMsgClass}`,
        ) as HTMLElement;

        if (show) {
            Utils.addClass(formControl, this.formOptions.controlErrorClass);
        } else {
            Utils.removeClass(formControl, this.formOptions.controlErrorClass);
        }
        if (errorControl) {
            errorControl.setAttribute('aria-hidden', `${!show}`);
        }
    };

    private fieldsToHide = (): void => {
        const hiddenFields: HTMLElement[] = Array.from(
            document.querySelectorAll('.form__control[data-hidden-field="hidden"]'),
        );
        hiddenFields.forEach((hiddenField) => Utils.addClass(hiddenField, `${this.formOptions.controlClass}--hidden`));
    };

    private setMinDate = (): void => {
        const dateInputs: HTMLInputElement[] = Array.from(this.form.querySelectorAll('input[type="date"]'));
        const today: Date = new Date();

        dateInputs.forEach((input: HTMLInputElement) => {
            input.setAttribute('min', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
        });
    };

    /*!
    .* Serialize all form data into an object of key/value pairs
    * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
    * @param  {Node}   form The form to serialize
    * @return {Object}      The serialized form data
    */
    private serializeObject = () => {
        const obj: SerializedObject = {};
        Array.prototype.slice
            .call(this.form.elements)
            .forEach((field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
                if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1)
                    return;
                if (field.type === 'select-multiple') {
                    const fieldOpt = field as HTMLSelectElement;
                    const options: string[] = [];

                    Array.prototype.slice.call(fieldOpt.options).forEach((option: HTMLOptionElement) => {
                        if (!option.selected) return;
                        options.push(option.value);
                    });
                    if (options.length) {
                        obj[fieldOpt.name] = options;
                    }
                    return;
                }
                field.hasAttribute('checked');
                if (['checkbox', 'radio'].indexOf(field.type) > -1 && !(field as HTMLInputElement).checked) return;
                obj[field.name] = field.value;
            });
        // console.log(obj);
        return obj;
    };

    private bindSubmit = () => {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (this.form.checkValidity()) {
                const submitBtn = this.form.querySelector('[type=submit]') as HTMLInputElement;
                submitBtn.disabled = true;
                Utils.addClass(submitBtn, this.formOptions.loadingClass);
                const url = this.form.getAttribute('action') as RequestInfo;
                const method = this.form.getAttribute('method')?.toUpperCase() || undefined;
                try {
                    grecaptcha.ready(() => {
                        grecaptcha.execute('6Lfu4doZAAAAAJ48ZrWc0x8mBZ9KkZaASfJFxmSg', { action: 'reservation' }).then(
                            (token) => {
                                (async () => {
                                    const dataToSend = new FormData(this.form);
                                    dataToSend.append('res_token', token);
                                    try {
                                        const response = await fetch(url, {
                                            method,
                                            body: dataToSend,
                                        });
                                        if (response.ok) {
                                            // const data = await response.json();
                                            this.showSuccessMsg();
                                        } else {
                                            throw new Error(`Http error: ${response.status}`);
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        this.showErrorStatus();
                                    } finally {
                                        submitBtn.disabled = false;
                                        this.form.reset();
                                        Utils.removeClass(submitBtn, this.formOptions.loadingClass);
                                    }
                                })();
                            },
                            (reason) => {
                                console.log(reason);
                                this.showErrorStatus();
                            },
                        );
                    });
                } catch (error) {
                    this.showErrorStatus();
                }
            } else {
                const elements: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = this.getFields();

                elements.forEach((element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
                    // console.log(!element.checkValidity());
                    this.markFieldAsError(element, !element.checkValidity());
                });
            }
        });
    };

    private bindRefreshFormButton = () => {
        const button = document.getElementById('NextReservation') as HTMLElement;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(e);
            this.refreshForm();
        });
    };

    private showErrorStatus = () => {
        const statusControl = this.form.querySelector(`.${this.formOptions.formStatusClass}`) as HTMLElement;
        if (statusControl) {
            Utils.addClass(statusControl, `${this.formOptions.formStatusClass}--show`);
        }
    };

    private showSuccessMsg = () => {
        const statusControl = this.form.nextElementSibling as HTMLElement;
        if (statusControl) {
            Utils.addClass(statusControl, `${this.formOptions.successMsgClass}--show`);
            Utils.addClass(this.form, `${this.formOptions.formClass}--hidden`);
        }
    };

    private refreshForm = () => {
        const statusControl = this.form.nextElementSibling as HTMLElement;
        if (statusControl) {
            Utils.removeClass(statusControl, `${this.formOptions.successMsgClass}--show`);
            Utils.removeClass(this.form, `${this.formOptions.formClass}--hidden`);
        }
    };
}
