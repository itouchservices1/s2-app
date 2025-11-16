import { Component} from '@angular/core';
import { environment } from '../../../../../../environments/environment'

@Component({
  selector      : 'app-loading',
  standalone    : false,
  templateUrl   : './loader.component.html',
  styleUrls     : ['./loader.component.css'],
})
export class LoadingComponent  {

  /**Define Variables */
  env = environment;


}