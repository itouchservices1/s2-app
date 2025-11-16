
import { Injectable, Inject  } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment' ;
import { DOCUMENT } from '@angular/common';
import { TextSetting } from '../textsetting';

@Injectable()
export class SeoService {

	/** Define Variables */
	env 						= environment;
	siteTitle			  : any = '';
	TextSetting           = TextSetting;
	

	/** Define Constructor */
	constructor(private meta: Meta, private title: Title,@Inject(DOCUMENT) private document :any) {
		this.siteTitle		=	this.env.SITE_TITLE;
	
	}


	/** For generating seo tags ****/ 
	generateTags = (config: any): void => {
	
		if (typeof(config.title) !== 'undefined'){
			this.setTitle(config.title, this.siteTitle);
			this.meta.updateTag({ property: 'og:title', content: config.title });		
			this.meta.updateTag({ name: 'twitter:title', content: config.title });
	
		}else{
			this.setTitle('', this.siteTitle);
			this.meta.updateTag({ name: 'twitter:title', content: this.siteTitle });
			this.meta.updateTag({ property: 'og:title', content: this.siteTitle});
		}
		if (typeof(config.card) !== 'undefined'){
			this.meta.updateTag({ name: 'twitter:card', content: config.card });
		}else{
			this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
		}
		if (typeof(config.site) !== 'undefined'){
			this.meta.updateTag({ name: 'twitter:site', content: config.site });
			this.meta.updateTag({ property: 'og:site_name', content: config.site });
		}else{
			this.meta.updateTag({ name: 'twitter:site', content: this.siteTitle});
			this.meta.updateTag({ property: 'og:site_name', content: this.siteTitle });
		}
		if (typeof(config.description) !== 'undefined'){
			this.meta.updateTag({ name: 'description', content: config.description });
			this.meta.updateTag({ name: 'twitter:description', content: config.description });
			this.meta.updateTag({ property: 'og:description', content: config.description });
		}else{
			this.meta.updateTag({ name: 'description', content: this.env.SITE_DESCRIPTION });
			this.meta.updateTag({ name: 'twitter:description', content: this.env.SITE_DESCRIPTION });
			this.meta.updateTag({ property: 'og:description', content: this.env.SITE_DESCRIPTION });
		}
		if (typeof(config.keywords) !== 'undefined'){
			this.meta.updateTag({ name: 'keywords', content: config.keywords });
			this.meta.updateTag({ name: 'twitter:keywords', content: config.keywords });
			this.meta.updateTag({ property: 'og:keywords', content: config.keywords });
		}else{
			this.meta.updateTag({ name: 'keywords', content: this.env.SITE_KEYWORDS });
			this.meta.updateTag({ name: 'twitter:keywords', content: this.env.SITE_KEYWORDS });
			this.meta.updateTag({ property: 'og:keywords', content: this.env.SITE_KEYWORDS });
		}
	
		if (typeof(config.type) !== 'undefined'){
			this.meta.updateTag({ property: 'og:type', content: config.type });
		}else{
			this.meta.updateTag({ property: 'og:type', content: 'Website' });
		}
	
		this.createLinkForcurrentRoute();
	}

	/** 
     * @desc  Function used to set title dynamically on each component
     * @method setTitle
     * @param {newTitle,siteTitle}
     * @return {none}
    */
	setTitle = ( newTitle: string, siteTitle: string): void => {
		if ( newTitle !== ''){
			// this.title.setTitle(newTitle + ' | ' + siteTitle);
			this.title.setTitle(newTitle);
		}else{
			this.title.setTitle(newTitle);
		}
	}

	/** 
     * @desc  Function used to set og:url parameter dynamically
     * @method createLinkForcurrentRoute
     * @param {none}
     * @return {none}
    */
	createLinkForcurrentRoute() {
		let link: HTMLLinkElement = this.document.createElement('link');
		let currentPage			  =	this.document.URL;
	
		if(currentPage.indexOf('http') != -1 && currentPage.indexOf('https') == -1){
			currentPage = currentPage.replace('http','https');
		}
		link.setAttribute('href', currentPage);
		this.meta.updateTag({ property: 'og:url', content: currentPage });
	}
}
