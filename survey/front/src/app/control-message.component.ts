import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from './_services/index';

@Component({
	selector: 'control-messages',
	standalone: false,
	template: `<div class="error-block-form" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ControlMessagesComponent {
	@Input() control: any = FormControl;
	@Input() name: string = '';

	constructor() { }
	get errorMessage(): any {
		for (const propertyName in this.control.errors) {
			if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
				// return "error in this field";
				return ValidationService.getValidatorErrorMessage(this.name, propertyName, this.control.errors[propertyName]);
			}
		}
		return null;
	}
}
