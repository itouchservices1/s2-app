import { Component, Input, OnChanges, SimpleChange, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

@Component({
    selector: 'app-password-strength',
    standalone : false,
    templateUrl: './password-strength.component.html',
    styleUrls: ['./password-strength.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PasswordStrengthComponent implements OnChanges {

    @Input() public passwordToCheck: string = "";
    @Output() passwordStrength = new EventEmitter<boolean>();

    bar0: any = "";
    bar1: any = "";
    bar2: any = "";
    bar3: any = "";
    msg: any = '';
    class: any = "default";
    private colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];

    constructor(public router: Router) {}



    private static checkStrength(p: string): number {
        let strength = 0;
    
        const lowerLetters = /[a-z]/.test(p);
        const upperLetters = /[A-Z]/.test(p);
        const numbers = /[0-9]/.test(p);
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/.test(p); // New line for special characters
    
        const flags = [lowerLetters, upperLetters, numbers, specialChars];
        const passedMatches = flags.filter(flag => flag).length;
    
        // Strength scoring logic
        if (passedMatches === 4 && p.length >= 8) {
            strength = 40; // Strong
        } else if (passedMatches === 3 && p.length >= 6) {
            strength = 30; // Average
        } else if (passedMatches === 2) {
            strength = 20; // Weak
        } else {
            strength = 10; // Poor
        }
    
        return strength;
    }
    

    /**A lifecycle hook that is called when any data-bound property of a directive changes.*/
    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        const password = changes['passwordToCheck']?.currentValue;
        let defaultbg: any | undefined;
       defaultbg = '#E3E3E3';
   
    
        this.setBarColors(4, defaultbg);
    
        if (password) {
            const c = this.getColor(PasswordStrengthComponent.checkStrength(password));
            this.setBarColors(c.idx, c.col);
            const pwdStrength = PasswordStrengthComponent.checkStrength(password);
            this.passwordStrength.emit(pwdStrength === 40); // true if strong
            switch (c.idx) {
                case 1: this.msg = 'Poor'; break;
                case 2: this.msg = 'Weak'; break;
                case 3: this.msg = 'Average'; break;
                case 4: this.msg = 'Strong'; break;
            }
        } else {
            this.msg = '';
        }
    }
    

    /**For getting bar color according to password strength */
    private getColor(s: number) {
        let idx = 0;
        if (s <= 10) {
            idx = 0;
        } else if (s <= 20) {
            idx = 1;
        } else if (s <= 30) {
            idx = 2;
        } else if (s <= 40) {
            idx = 3;
        } else {
            idx = 4;
        }
        return {
            idx: idx + 1,
            col: this.colors[idx]
        };
    }

    /**For setting password bar colors */
    private setBarColors(count: number, col: string) {
        for (let n = 0; n < count; n++) {
            if (n == 0)
                this.bar0 = col;
            else if (n == 1)
                this.bar1 = col;
            else if (n == 2)
                this.bar2 = col;
            else if (n == 3)
                this.bar3 = col;
        }
    }
}

