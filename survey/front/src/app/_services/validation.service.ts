import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ERROR_MESSAGES } from '../global-error';

@Injectable()

export class ValidationService {
	errorMessage = ERROR_MESSAGES
	/**Define Constructor */
	constructor() { }
	static getValidatorErrorMessage = (name: string, validatorName: string, validatorValue?: any): any => {
		let MaxLength = (validatorValue.requiredLength) ? validatorValue.requiredLength : environment.MAX_CHAR;
		const config: any = {

			required: name + ' is required.',
			invalidEmailAddress: 'Please enter valid email id here.',
			invalidPassword: 'Password must be a minimum of 8 characters and include uppercase, lowercase, numbers, and special characters.',
			invalidNumber: 'Phone number should be numeric and length should be minimum  of 6 and maximum of 12 digits.',
			invalidText: 'Please enter only numeric value.',
			maxlength: `Maximum ${MaxLength} characters allowed.`,
			matchPassword: `Passwords do not match.`,
			cannotContainSpace: `No white spaces allowed in username.`,
			invalidImageUrl: `Invalid Image Url.`,
			invalidImage: `The image must be a type of: jpeg, jpg, png.`,
			redemptioninvalidNumber: `Redemption code must be numeric & contain 4 digit number.`,
			specialCharMsg: `This field should not contain any special character and numeric value.`,
			invalidUrl: `Invalid Url.`
		};
		return config[validatorName];

	}


/** 
 * @desc  Function used to required confirm match password
 * @method RequiredConfirmMatchPassword
 * @param {AbstractControl}
 * @return {ValidationErrors | null}
 */
static RequiredConfirmMatchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	if (!control.parent || !(control.parent instanceof FormGroup)) {
	  return null;
	}
  
	const formGroup = control.parent as FormGroup;
	const passwordControl = formGroup.get('password') ||  formGroup.get('new_password');
	const confirmPasswordControl = formGroup.get('confirm_password');
  
	if (!passwordControl || !confirmPasswordControl) {
	  return null;
	}
  
	const password = passwordControl.value;
	const confirmPassword = confirmPasswordControl.value;
  
	//  If password is filled but confirm password is empty
	if (password && !confirmPassword) {
	  return { required: true };
	}
  
	//  If both are filled but don't match
	if (password && confirmPassword && password !== confirmPassword) {
	  return { matchPassword: true };
	}
  
	return null;
  };
  

	/** 
   * @desc  Function used to check email validation
   * @method emailValidator
   * @param control
   * @return {true}
   */

	static emailValidator = (control: any): any => {
		if (control.value) {

			if ((typeof (control.value) === 'string') && control.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i)) {
				return null;
			} else {
				return { invalidEmailAddress: true };
			}
		}
	}







	/** 
		* @desc  Function used to check password valid regex
		* @method passwordValidator
		* @param {control,value}
		* @return {true}
		*/

	static passwordValidator = (control: any): any => {
		if (control.value) {

			// /^(?=.*[0-9])(?=.*[A-Za-z])[a-zA-Z0-9!@#$%^&*]{8,100}$/ Password –  combination of uppercase, alphabet, lowercase, numeric and special characters.
			if ((typeof (control.value) === 'string') && control.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {

		
				return null;
			} else {
				return { invalidPassword: true };
			}
		}
	}







	/** 
	* @desc  Function used to check mobile number regex
	* @method numberValidator
	* @param {control}
	* @return {true}
	*/

	static numberValidator = (control: any): any => {
		if (control.value) {


			if ((typeof (control.value) === 'string') && control.value.match(/^[0-9]{6,12}$/)) {
				return null;
			} else {
				return { invalidNumber: true };
			}
		}
	}

	/** 
	 * @desc Function used to check mobile number regex
	 * @method phoneNumberValidator
	 * @param {control}
	 * @return {true}
	*/
	static phoneNumberValidator = (control: any): any => {
		if (control.value) {
			let phoneNumberLength = (control.value).length;
			if (phoneNumberLength >= 8 && phoneNumberLength <= 14) {
				return null;
			} else {
				return { invalidNumber: true };
			}

		}
	}



	// This function are used for only numeric condition
	static numericValidator = (control: any): any => {
		if (isNaN(control.value) === false) {
			return null;
		} else {
			return { invalidText: true };
		}
	}


	/** 
   * @desc  Function used to check only numeric conditon on edit form
   * @method editNumericValidator
   * @param {control}
   * @return {true}
   */
	static editNumericValidator = (control: any): any => {
		if (isNaN(control.value) === false) {
			return null;
		} else {
			return { invalidText: true };
		}
	}


	/** 
   * @desc  Function used to check password or confirm password validation
   * @method MatchPassword
   * @param {AC}
   * @return {null}
   */



	static MatchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		if (!control.parent || !(control.parent instanceof FormGroup)) {
			return null;
		}

		const formGroup = control.parent as FormGroup;
		const passwordControl = formGroup.get('password');
		const confirmPasswordControl = formGroup.get('confirm_password');

		if (!passwordControl || !confirmPasswordControl) {
			return null;
		}

		const password = passwordControl.value;
		const confirmPassword = confirmPasswordControl.value;

		if (password !== confirmPassword) {
			return { matchPassword: true };
		} else {
			return null;
		}
	}



	/** 
   * @desc  function is used to check if entered username containes whitespaces or not
   * @method UsernameValidator
   * @param {control}
   * @return {null}
   */
	static UsernameValidator = (control: AbstractControl): ValidationErrors | null => {


		let value: string = control.value || '';
		if (!value) {
			return null
		}

		if (value.indexOf(' ') >= 0) {
			return {
				cannotContainSpace: true
			}
		} else {
			return null;
		}



	}




	/** 
	 * @desc  function is used to validate all form fields
	 * @method redemptionValidator
	 * @param {control}
	 * @return {true}
	 * 
	 */

	static validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });

			} else if (control instanceof FormGroup) {
				ValidationService.validateAllFormFields(control);

			} else if (control instanceof FormArray) {
				if (control.length > 0) {
					control.controls.map(element => {
						ValidationService.validateAllFormFields(element as FormGroup)
					});
				}
			}
		});
	}





	/** 
	 * @desc  function used to validate uploaded image validations
	 * @method validateImageField
	 * @param {files}
	 * @return {validation}
	 * 
	 */

	public validateImageField = (files: any): any => {
		const validation: any = {};
		validation.status = false;
		validation.message = this.errorMessage.uploadFile


		if (files.length > 0) {
			const MAX_IMAGE_SIZE_IN_MB = environment.MAX_FILE_UPLOAD_LIMIT;
			const ALLOWED_DOCUMENT_EXTENTIONS = environment.ALLOWED_IMAGE_EXTENTIONS;
			const UPLOAD_FILE_SIZE = MAX_IMAGE_SIZE_IN_MB; // file size in MB

			let size = files[0].size ? files[0].size.toFixed(2) : files[0].file.size.toFixed(2);
			let ext = (files[0]['name']) ? files[0]['name'].split('.').pop() : files[0].file['name'].split('.').pop();
			ext = ext.toLowerCase();
			let allowed_size: any = size / Math.pow(1024, 2);

			if (!ALLOWED_DOCUMENT_EXTENTIONS.includes(ext)) {

				validation.status = false;
				validation.message = this.errorMessage.validFileExtension

			} else if (allowed_size > UPLOAD_FILE_SIZE) {
				validation.status = false;
				validation.message = this.errorMessage.uploadValidSize + ' ' + MAX_IMAGE_SIZE_IN_MB + ' MB.';

			} else {
				validation.status = true;
			}
		}
		return validation;


	}

	/** 
	 * @desc  function used to validate excel field upload
	 * @method validateExcelField
	 * @param {files}
	 * @return {validation}
	 * 
	 */

	public validateExcelField = (files: any): any => {
		const validation: any = {};
		validation.status = false;
		validation.message = this.errorMessage.PLEASE_UPLOAD_CSV_XLSX_FILE

		if (files.length > 0) {

			const ALLOWED_EXCEL_EXTENTIONS = environment.ALLOWED_EXCEL_EXTENTIONS;
			let ext: any = files[0]['name'].split('.').pop();
			ext = ext.toLowerCase();

			if (!ALLOWED_EXCEL_EXTENTIONS.includes(ext)) {

				validation.status = false;
				validation.message = this.errorMessage.VALID_TYPE_EXTENSION_EXCEL

			} else {
				validation.status = true;
			}
		}
		return validation;


	}






	

		






}
