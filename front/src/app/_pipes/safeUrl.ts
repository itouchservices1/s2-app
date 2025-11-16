import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone : false
})
export class SafeUrlPipe implements PipeTransform {
	constructor(private domSanitizer: DomSanitizer) {}
	transform(url:any) {	
		 return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
	}
}