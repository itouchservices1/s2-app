import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class EncrDecrService {

     /** Define Variables */
	env 				= environment

	/**Define constructor */
	constructor() { }
 
	
	 /** 
     * @desc  Function used to set  (encrypt/encrypting)  value
     * @method set
     * @param {keys,value}
     * @return {encrypted string}
     */


	set(keys: any, value: any): any {
		const key = CryptoJS.enc.Utf8.parse(keys);
		const iv = CryptoJS.enc.Utf8.parse(this.env.ENCRIPTION_IV);
		const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
			iv: iv,
			format: CryptoJS.format.Hex,
			mode: CryptoJS.mode.CTR,
			padding: CryptoJS.pad.NoPadding
		});
		return encrypted.toString();
	}


		
	 /** 
     * @desc  Function used to set (decrypt/decrypting) the value
     * @method get
     * @param {keys,value}
     * @return {dencrypted string}
     */

	get(keys: any, value: any): any {
		const key = CryptoJS.enc.Utf8.parse(keys);
		const iv = CryptoJS.enc.Utf8.parse(this.env.ENCRIPTION_IV);
		const decrypted = CryptoJS.AES.decrypt(value, key, {
			iv: iv,
			format: CryptoJS.format.Hex,
			mode: CryptoJS.mode.CTR,
			padding: CryptoJS.pad.NoPadding
			
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}
}
