import { ValidatorFn, AbstractControl } from "@angular/forms";

export function dateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const today = new Date().getTime();
      if(!(control && control.value)) {
        // if there's no control or no value, that's ok
        return null;
      }
      const date = new Date(control.value).getTime();
      // return null if there's no errors
      return date > today 
        ? {invalidDate: 'You cannot use future dates' } 
        : null;
    }
  }