import { FormControl } from '@angular/forms';

export class FormValidators {

    static emailValidator(control: FormControl) {
        if (!control.value.match(/^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)) {
            return { invalidEmailAddress: true };
        }
        return null;
    }
    static numberValidation(control: FormControl) {
        if (control && control.value !== null && (/\D/g).test(control.value)) {
            return { onlyNumbers: true };
        }
        return null;
    }
    static maxValueValidation(control: FormControl) {
        if (!control.value.match(/^([1-6]|[1-5](\.[0-9]{1}|.[0-9]{2}))$|^$/)) {
            return { maxValue: true };
        }
        return null;
    }
}
