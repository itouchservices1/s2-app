import { Component,Input } from '@angular/core';
import { environment } from '../../../../../../environments/environment'
@Component({
	selector		: 'app-no-record-found',
	standalone      : false,
	templateUrl		: './no-record-found.component.html',
	styleUrls		: ['./no-record-found.component.css']
})

export class NoRecordFoundComponent  {


	@Input() endVoting       : any     = "";
	@Input() rewardIsDeleted : any     = "";
	/**Define Vriables **/
	env = environment;

	
}
